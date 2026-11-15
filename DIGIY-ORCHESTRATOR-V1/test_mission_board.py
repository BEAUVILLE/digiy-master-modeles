import copy
import json
import tempfile
from pathlib import Path
import unittest
from mission_board import orchestrer,validate_snapshot,validate_mission,read_json

CORE={'contract':'DIGIYLYFE-ORCHESTRATOR-SNAPSHOT-V1','mode':'read-only','status':'PASS',
      'state':{'capabilities':['LOC','RESA','DRIVER']},'alerts':[],'relations':[],'priorities':[]}
MISSION={'mission_id':'DIGIY-CONTROLES-001','mode':'lecture_seule','budget_supplementaire':0,
         'actions_autorisees':[],'validation_maitre':False,
         'controles':[{'capacite':'LOC','controle':'LOC-GATE','statut':'ok','preuve':'reference_locale_non_verifiee'}]}

def change(path,value):
    data=copy.deepcopy(MISSION)
    data[path]=value
    return data

class TestMissions(unittest.TestCase):
    def test_nominal_still_requires_human(self):
        r=orchestrer(CORE,MISSION)
        self.assertEqual(r['decision']['statut'],'A_RELIRE')
        self.assertFalse(r['decision']['autoriser_fusion'])
        self.assertFalse(r['decision']['preuves_verifiees_independamment'])
    def test_blocking_control(self):
        m=copy.deepcopy(MISSION);m['controles'][0]['statut']='bloque'
        self.assertEqual(orchestrer(CORE,m)['decision']['statut'],'NO_GO')
    def test_unknown_remains_unknown(self):
        m=copy.deepcopy(MISSION);m['controles'][0]['statut']='inconnu'
        self.assertEqual(orchestrer(CORE,m)['decision']['statut'],'A_VERIFIER')
    def test_core_fail_closed(self):
        s=copy.deepcopy(CORE);s['status']='FAIL_CLOSED'
        self.assertEqual(orchestrer(s,MISSION)['decision']['statut'],'NO_GO')
    def test_core_critical_alert(self):
        s=copy.deepcopy(CORE);s['alerts']=[{'severity':'critical'}]
        self.assertEqual(orchestrer(s,MISSION)['decision']['statut'],'NO_GO')
    def test_core_alerts(self):
        s=copy.deepcopy(CORE);s['status']='PASS_WITH_ALERTS'
        self.assertEqual(orchestrer(s,MISSION)['decision']['statut'],'A_VERIFIER')
    def test_invalid_snapshot(self):
        s=copy.deepcopy(CORE);s['contract']='FAKE'
        with self.assertRaises(ValueError):orchestrer(s,MISSION)
    def test_unregistered_capability(self):
        m=copy.deepcopy(MISSION);m['controles'][0]['capacite']='MARKET'
        with self.assertRaises(ValueError):orchestrer(CORE,m)
    def test_no_money(self):
        with self.assertRaises(ValueError):orchestrer(CORE,change('budget_supplementaire',10))
    def test_no_boolean_money(self):
        with self.assertRaises(ValueError):orchestrer(CORE,change('budget_supplementaire',False))
    def test_no_external_actions(self):
        with self.assertRaises(ValueError):orchestrer(CORE,change('actions_autorisees',['github_write']))
    def test_no_implicit_human_validation(self):
        with self.assertRaises(ValueError):orchestrer(CORE,change('validation_maitre',True))
    def test_unknown_key_rejected(self):
        m=copy.deepcopy(MISSION);m['access_token']='secret'
        with self.assertRaises(ValueError):orchestrer(CORE,m)
    def test_no_free_text_or_secrets(self):
        m=copy.deepcopy(MISSION);m['controles'][0]['preuve']='https://private.example/secret'
        with self.assertRaises(ValueError):orchestrer(CORE,m)
    def test_no_free_text_status(self):
        m=copy.deepcopy(MISSION);m['controles'][0]['statut']='OK, mot de passe...'
        with self.assertRaises(ValueError):orchestrer(CORE,m)
    def test_duplicate_control(self):
        m=copy.deepcopy(MISSION);m['controles'].append(m['controles'][0])
        with self.assertRaises(ValueError):orchestrer(CORE,m)
    def test_no_full_data_leak(self):
        r=orchestrer(CORE,MISSION)
        self.assertNotIn('reference_locale_non_verifiee',str(r))
    def test_malformed_status_list_rejected(self):
        m=copy.deepcopy(MISSION);m['controles'][0]['statut']=['ok']
        with self.assertRaises(ValueError):orchestrer(CORE,m)
    def test_malformed_proof_list_rejected(self):
        m=copy.deepcopy(MISSION);m['controles'][0]['preuve']=['non_fournie']
        with self.assertRaises(ValueError):orchestrer(CORE,m)
    def test_malformed_core_status_list_rejected(self):
        s=copy.deepcopy(CORE);s['status']=['PASS']
        with self.assertRaises(ValueError):orchestrer(s,MISSION)
    def test_role_order(self):
        r=orchestrer(CORE,MISSION)
        self.assertEqual([x['nom'] for x in r['roles']],['ECLAIREUR','CONTROLEUR','MAITRE'])
    def test_determinism(self):
        self.assertEqual(orchestrer(CORE,MISSION),orchestrer(CORE,MISSION))
    def test_no_symlink(self):
        with tempfile.TemporaryDirectory() as t:
            root=Path(t);(root/'a.json').write_text('{}');(root/'b.json').symlink_to(root/'a.json')
            with self.assertRaises(ValueError):read_json(str(root/'b.json'),1000)
    def test_bounded_input(self):
        with tempfile.TemporaryDirectory() as t:
            file=Path(t)/'a.json';file.write_text('{}'*2000)
            with self.assertRaises(ValueError):read_json(str(file),100)
    def test_full_example(self):
        source=Path(__file__).parent/'mission_exemple.json'
        m=json.loads(source.read_text())
        r=orchestrer(CORE,m)
        self.assertEqual(r['decision']['statut'],'A_VERIFIER')
    def test_stays_no_go_if_one_blocked(self):
        m=copy.deepcopy(MISSION);m['controles'] += [{'capacite':'RESA','controle':'RESA-GATE','statut':'bloque','preuve':'non_fournie'}]
        self.assertEqual(orchestrer(CORE,m)['decision']['statut'],'NO_GO')

if __name__=='__main__':unittest.main()
