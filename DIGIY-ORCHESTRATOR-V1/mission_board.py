#!/usr/bin/env python3
"""Bureau des missions DIGIY, consommateur du snapshot V1 autoritaire.

Aucun accès réseau, aucun sous-processus, aucune connexion à Supabase.
Le bureau traite uniquement des constats codifiés, jamais des secrets ni des
preuves privées. Toute modification métier demeure hors de ce programme.
"""

from __future__ import annotations
import argparse
import json
import re
from pathlib import Path
from typing import Any

SNAPSHOT_CONTRACT = 'DIGIYLYFE-ORCHESTRATOR-SNAPSHOT-V1'
STATUS = {'PASS', 'PASS_WITH_ALERTS', 'FAIL_CLOSED'}
CONTROL_STATUS = {'ok', 'attention', 'bloque', 'inconnu'}
ROLES = ('ECLAIREUR', 'CONTROLEUR', 'MAITRE')
ID = re.compile(r'^DIGIY-[A-Z0-9-]{4,45}$')
CONTROL = re.compile(r'^[A-Z0-9][A-Z0-9_-]{2,48}$')
MAX_CONTROLS = 30
MAX_SNAPSHOT_BYTES = 1_000_000
MAX_MISSION_BYTES = 60_000


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValueError(message)


def validate_snapshot(snapshot: Any) -> set[str]:
    require(isinstance(snapshot, dict), 'Snapshot invalide')
    require(snapshot.get('contract') == SNAPSHOT_CONTRACT, 'Contrat CORE inattendu')
    require(snapshot.get('mode') == 'read-only', 'CORE hors mode lecture seule')
    require(isinstance(snapshot.get('status'), str) and snapshot['status'] in STATUS, 'Statut CORE inconnu')
    for field in ('state', 'alerts', 'relations', 'priorities'):
        require(field in snapshot, 'Champ CORE manquant: '+field)
    require(isinstance(snapshot['state'], dict), 'Etat CORE invalide')
    require(all(isinstance(snapshot[k], list) for k in ('alerts','relations','priorities')), 'Sorties CORE invalides')
    capabilities = snapshot['state'].get('capabilities')
    require(isinstance(capabilities, list) and len(capabilities) <= 40, 'Capacites CORE invalides')
    require(all(isinstance(v, str) and CONTROL.fullmatch(v) for v in capabilities), 'Code capacite invalide')
    require(len(capabilities) == len(set(capabilities)), 'Capacite dupliquee')
    return set(capabilities)


def validate_mission(mission: Any, capabilities: set[str]) -> None:
    require(isinstance(mission, dict), 'Mission invalide')
    require(set(mission) == {'mission_id','mode','budget_supplementaire','actions_autorisees','validation_maitre','controles'}, 'Contrat mission inattendu')
    require(isinstance(mission['mission_id'], str) and ID.fullmatch(mission['mission_id']), 'ID mission non autorise')
    require(mission['mode'] == 'lecture_seule', 'Mode mission non autorise')
    require(type(mission['budget_supplementaire']) is int and mission['budget_supplementaire'] == 0, 'Depense interdite')
    require(mission['actions_autorisees'] == [], 'Action externe interdite')
    require(mission['validation_maitre'] is False, 'Validation humaine jamais implicite')
    controls = mission['controles']
    require(isinstance(controls, list) and 1 <= len(controls) <= MAX_CONTROLS, 'Nombre de controles invalide')
    seen = set()
    for item in controls:
        require(isinstance(item, dict) and set(item)=={'capacite','controle','statut','preuve'}, 'Contrôle non codifié')
        cap,ctrl,statut,preuve = (item[k] for k in ('capacite','controle','statut','preuve'))
        require(isinstance(cap,str) and cap in capabilities, 'Capacite absente du CORE')
        require(isinstance(ctrl,str) and CONTROL.fullmatch(ctrl), 'Code de controle invalide')
        require(isinstance(statut, str) and statut in CONTROL_STATUS, 'Statut de controle invalide')
        # Seulement état de disponibilité, pas de chemins, URLs, messages ni éléments privés.
        require(isinstance(preuve, str) and preuve in {'non_fournie','reference_locale_non_verifiee'}, 'Preuve libre ou privée interdite')
        require((cap,ctrl) not in seen, 'Contrôle dupliqué')
        seen.add((cap,ctrl))


def orchestrer(snapshot: dict[str,Any], mission: dict[str,Any]) -> dict[str,Any]:
    cap = validate_snapshot(snapshot)
    validate_mission(mission, cap)
    blocked_core = snapshot['status'] == 'FAIL_CLOSED' or any(
        isinstance(a,dict) and a.get('severity') == 'critical' for a in snapshot['alerts'])
    controls=[]
    for item in mission['controles']:
        controls.append({
            'capacite':item['capacite'], 'controle':item['controle'], 'statut':item['statut'],
            'preuve_verifiee_independamment':False,
            'transmission':['ECLAIREUR','CONTROLEUR','MAITRE'],
        })
    severity = {'bloque':0,'attention':1,'inconnu':2,'ok':3}
    controls.sort(key=lambda x:(severity[x['statut']], x['capacite'],x['controle']))
    blocked = blocked_core or any(c['statut']=='bloque' for c in controls)
    if blocked:
        verdict='NO_GO'
    elif any(c['statut'] in {'inconnu','attention'} for c in controls) or snapshot['status']=='PASS_WITH_ALERTS':
        verdict='A_VERIFIER'
    else:
        verdict='A_RELIRE'   # Aucun rapport n'autorise une mutation.
    return {
        'contrat':'DIGIYLYFE-BUREAU-MISSIONS-V1',
        'source':{'contrat':snapshot['contract'],'mode':snapshot['mode'],'statut':snapshot['status']},
        'mission_id':mission['mission_id'],
        'roles':[{'nom':r,'nature':'controle_programme' if r!='MAITRE' else 'decision_humaine'} for r in ROLES],
        'constats':controls,
        'decision':{'statut':verdict,'validation_humaine_requise':True,
                    'preuves_verifiees_independamment':False,
                    'autoriser_fusion':False,'autoriser_deploiement':False,
                    'autoriser_paiement':False,'autoriser_contact':False},
        'regles':{'cout_supplementaire':0,'lecture_seule':True,'source_autoritaire':'DIGIY ORCHESTRATOR V1'},
    }


def read_json(filename: str, max_bytes: int) -> Any:
    path=Path(filename)
    require(path.is_file() and not path.is_symlink(), 'Fichier de contrôle absent ou lien symbolique')
    require(path.stat().st_size <= max_bytes, 'Fichier de contrôle trop grand')
    return json.loads(path.read_text(encoding='utf-8'))


def main() -> int:
    ap=argparse.ArgumentParser(description='DIGIY — Bureau des missions, sortie lecture seule')
    ap.add_argument('--snapshot', required=True, help='JSON produit par DIGIY ORCHESTRATOR V1')
    ap.add_argument('--mission', required=True, help='Mission structurée locale et sans données privées')
    args=ap.parse_args()
    try:
        result=orchestrer(read_json(args.snapshot,MAX_SNAPSHOT_BYTES),read_json(args.mission,MAX_MISSION_BYTES))
    except (ValueError, OSError, UnicodeError, json.JSONDecodeError) as exc:
        print(json.dumps({'statut':'NO_GO','erreur':type(exc).__name__, 'validation_humaine_requise':True}))
        return 2
    print(json.dumps(result,ensure_ascii=False,indent=2))
    return 0

if __name__=='__main__':
    raise SystemExit(main())
