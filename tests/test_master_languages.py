"""Pilot locales in canonical DIGIY member-card and BUILD master, no new costs."""
import json
import re
import shutil
import subprocess
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
CARD=(ROOT/"MASTER-CARTE-ADHERENT-V1/index.html").read_text(encoding="utf-8")
BUILD=(ROOT/"BUILD/MASTER-MAITRE-BUILD/index.html").read_text(encoding="utf-8")
LANG=json.loads((ROOT/"MASTER-CORE-WORLD-V1/config/languages.json").read_text(encoding="utf-8"))
LANGS={"fr","en","es","pt","it","de","nl","ar","wo","zh"}

class MasterTenLang(unittest.TestCase):
    def test_global_locale_registry(self):
        codes=[x["code"] for x in LANG["languages"]]
        self.assertEqual(set(codes),LANGS)
        self.assertEqual(len(codes),10)
        self.assertEqual(LANG["rtl"],["ar"])
        self.assertEqual(LANG["default"],"fr")

    def test_card_and_build_expose_exact_ten_locales(self):
        self.assertIn('const order=["fr","en","es","pt","it","de","nl","ar","wo","zh"]',CARD)
        self.assertIn('["fr","en","es","pt","it","de","nl","ar","wo","zh"].forEach(code=>',BUILD)
        for html in (CARD,BUILD):
            self.assertIn('wo:{',html)
            self.assertIn('zh:{',html)
            self.assertIn('lang==="zh"?"zh-CN":lang',html)
            self.assertIn('code==="zh"?"中文":code.toUpperCase()',html)
            self.assertIn('https://wa.me/',html)

    def test_full_wo_and_zh_translations(self):
        for html in (CARD,BUILD):
            fr=re.search(r'\nfr:\{(.*?)\},\nen:',html,re.S)
            self.assertIsNotNone(fr)
            names=set(re.findall(r'(\w+):',fr.group(1)))
            self.assertGreater(len(names),15)
            for code in ("wo","zh"):
                block=re.search(r'\n'+code+r':(\{.*?\}),\n(?:zh|fr):',html,re.S)
                self.assertIsNotNone(block)
                data=json.loads(block.group(1))
                self.assertEqual(set(data),names)
                self.assertTrue(all(isinstance(x,str) and x.strip() for x in data.values()))

    @unittest.skipUnless(shutil.which("node"),"Node.js unavailable")
    def test_inline_script_parses(self):
        for html in (CARD,BUILD):
            scripts=re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',html,re.S)
            script=next((s for s in scripts if "const I18N={" in s),"")
            self.assertTrue(script)
            result=subprocess.run(["node","--check"],input=script,text=True,capture_output=True,check=False)
            self.assertEqual(result.returncode,0,result.stderr)

if __name__=="__main__":
    unittest.main()
