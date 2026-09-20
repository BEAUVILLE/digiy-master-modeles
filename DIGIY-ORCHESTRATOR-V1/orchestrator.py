#!/usr/bin/env python3
"""
DIGIY ORCHESTRATOR V1
Read-only cross-core audit for DIGIYLYFE MASTER.

No network, no database write, no mutation.
Reads the existing repository tree and emits a global JSON snapshot.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


REQUIRED_FILES = {
    "runtime_registry": "MASTER-CORE-WORLD-V1/config/runtime-registry.json",
    "runtime_contract": "MASTER-CORE-WORLD-V1/config/runtime-contract.json",
    "capabilities": "MASTER-CORE-WORLD-V1/config/capabilities.json",
    "needs": "MASTER-CORE-WORLD-V1/config/needs.json",
    "sovereignty": "MASTER-CORE-WORLD-V1/config/pro-sovereignty-contract.json",
    "mcp_tools": "DIGIY-MCP-V1/contracts/tools.json",
}

MASTER_HIERARCHY = [
    "CORE MONDIAL",
    "PAYS",
    "TERRITOIRE",
    "ZONE",
    "BESOIN",
    "PROFESSIONNEL",
    "OUVRIR",
]


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def alert(code: str, severity: str, message: str, source: str) -> dict[str, str]:
    return {
        "code": code,
        "severity": severity,
        "message": message,
        "source": source,
    }


def load_required_json(repo_root: Path, relpath: str) -> Any:
    path = repo_root / relpath
    if not path.is_file():
        raise FileNotFoundError(relpath)
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"{relpath}: JSON invalide: {exc}") from exc


def ids(items: list[dict[str, Any]]) -> list[str]:
    out: list[str] = []
    for item in items:
        value = item.get("id")
        if isinstance(value, str) and value.strip():
            out.append(value.strip())
    return out


def duplicate_values(values: list[str]) -> list[str]:
    seen: set[str] = set()
    dupes: set[str] = set()
    for value in values:
        if value in seen:
            dupes.add(value)
        seen.add(value)
    return sorted(dupes)


def discover_master_surfaces(repo_root: Path) -> list[str]:
    prefixes = (
        "MASTER-MAITRE-",
        "MASTER-PAYS-",
        "MASTER-TERRITOIRE-",
        "MASTER-CORE-",
        "DIGIY-MCP-",
    )
    names: list[str] = []
    for child in repo_root.iterdir():
        if child.is_dir() and child.name.startswith(prefixes):
            names.append(child.name)
    return sorted(names)


def audit(repo_root: Path) -> dict[str, Any]:
    loaded: dict[str, Any] = {}
    alerts: list[dict[str, str]] = []

    # Fail closed: every authoritative source must exist and parse.
    for key, relpath in REQUIRED_FILES.items():
        try:
            loaded[key] = load_required_json(repo_root, relpath)
        except (FileNotFoundError, ValueError) as exc:
            alerts.append(
                alert(
                    "AUTHORITY_SOURCE_UNAVAILABLE",
                    "critical",
                    str(exc),
                    relpath,
                )
            )

    if any(a["severity"] == "critical" for a in alerts):
        return {
            "contract": "DIGIYLYFE-ORCHESTRATOR-SNAPSHOT-V1",
            "generated_at": utc_now(),
            "mode": "read-only",
            "status": "FAIL_CLOSED",
            "state": {},
            "alerts": alerts,
            "relations": [],
            "priorities": [
                {
                    "rank": 1,
                    "action": "Rétablir les sources autoritaires manquantes ou invalides avant toute lecture globale.",
                }
            ],
        }

    registry = loaded["runtime_registry"]
    runtime_contract = loaded["runtime_contract"]
    capabilities_doc = loaded["capabilities"]
    needs_doc = loaded["needs"]
    sovereignty = loaded["sovereignty"]
    mcp = loaded["mcp_tools"]

    countries = registry.get("countries", [])
    capabilities = capabilities_doc.get("capabilities", [])
    needs = needs_doc.get("needs", [])
    tools = mcp.get("tools", [])

    country_ids = ids(countries)
    capability_ids = ids(capabilities)
    need_ids = ids(needs)

    enabled_countries = sorted(
        c.get("id")
        for c in countries
        if isinstance(c, dict) and c.get("enabled") is True and isinstance(c.get("id"), str)
    )
    disabled_countries = sorted(
        c.get("id")
        for c in countries
        if isinstance(c, dict) and c.get("enabled") is False and isinstance(c.get("id"), str)
    )

    # Registry integrity.
    for duplicate in duplicate_values(country_ids):
        alerts.append(
            alert(
                "DUPLICATE_COUNTRY_ID",
                "high",
                f"Identifiant pays dupliqué: {duplicate}",
                REQUIRED_FILES["runtime_registry"],
            )
        )

    for duplicate in duplicate_values(need_ids):
        alerts.append(
            alert(
                "DUPLICATE_NEED_ID",
                "high",
                f"Besoin CORE dupliqué: {duplicate}",
                REQUIRED_FILES["needs"],
            )
        )

    for duplicate in duplicate_values(capability_ids):
        alerts.append(
            alert(
                "DUPLICATE_CAPABILITY_ID",
                "high",
                f"Capacité dupliquée: {duplicate}",
                REQUIRED_FILES["capabilities"],
            )
        )

    # Doctrine guard: MARKET is legacy; COMMERCE is active.
    if "MARKET" in capability_ids:
        alerts.append(
            alert(
                "LEGACY_MARKET_REGISTERED",
                "high",
                "MARKET est encore enregistré comme capacité alors que la doctrine active le déclare hors service.",
                REQUIRED_FILES["capabilities"],
            )
        )

    if "COMMERCE" not in capability_ids:
        alerts.append(
            alert(
                "COMMERCE_CAPABILITY_NOT_REGISTERED",
                "medium",
                "COMMERCE / MON COMMERCE est la capacité active doctrinale mais l'identifiant COMMERCE n'apparaît pas dans le registre des capacités.",
                REQUIRED_FILES["capabilities"],
            )
        )

    # Runtime guards.
    public_rules = runtime_contract.get("public_rules", {})
    registry_rules = registry.get("rules", {})

    if public_rules.get("planned_territory_is_not_public") is not True:
        alerts.append(
            alert(
                "PLANNED_TERRITORY_GUARD_MISSING",
                "critical",
                "Le runtime ne garantit pas explicitement qu'un territoire planned reste non public.",
                REQUIRED_FILES["runtime_contract"],
            )
        )

    if public_rules.get("configuration_failure_is_fail_closed") is not True:
        alerts.append(
            alert(
                "RUNTIME_FAIL_CLOSED_MISSING",
                "critical",
                "Le runtime ne garantit pas explicitement le fail closed sur incohérence de configuration.",
                REQUIRED_FILES["runtime_contract"],
            )
        )

    if registry_rules.get("disabled_country_is_never_public") is not True:
        alerts.append(
            alert(
                "DISABLED_COUNTRY_PUBLIC_GUARD_MISSING",
                "critical",
                "Le registre ne garantit pas explicitement qu'un pays désactivé reste non public.",
                REQUIRED_FILES["runtime_registry"],
            )
        )

    # MCP guards.
    if mcp.get("mode") != "public-read-only":
        alerts.append(
            alert(
                "MCP_MODE_NOT_READ_ONLY",
                "critical",
                f"Mode MCP inattendu: {mcp.get('mode')!r}",
                REQUIRED_FILES["mcp_tools"],
            )
        )

    non_readonly_tools = sorted(
        t.get("name", "<sans-nom>")
        for t in tools
        if isinstance(t, dict) and t.get("read_only") is not True
    )
    if non_readonly_tools:
        alerts.append(
            alert(
                "MCP_TOOL_NOT_READ_ONLY",
                "critical",
                "Outils MCP non marqués read-only: " + ", ".join(non_readonly_tools),
                REQUIRED_FILES["mcp_tools"],
            )
        )

    forbidden = set(mcp.get("forbidden_v1", []))
    for expected in ("payment", "reservation_write", "subscription_write", "admin_data", "private_contact_data"):
        if expected not in forbidden:
            alerts.append(
                alert(
                    "MCP_FORBIDDEN_GUARD_MISSING",
                    "high",
                    f"Garde MCP V1 absente de forbidden_v1: {expected}",
                    REQUIRED_FILES["mcp_tools"],
                )
            )

    # Professional sovereignty guards.
    commercial_rules = sovereignty.get("commercial_rules", {})
    if commercial_rules.get("zero_percent_commission_core_principle") is not True:
        alerts.append(
            alert(
                "ZERO_COMMISSION_GUARD_MISSING",
                "high",
                "Le contrat de souveraineté ne verrouille pas explicitement le principe 0% commission.",
                REQUIRED_FILES["sovereignty"],
            )
        )
    if commercial_rules.get("direct_relationship_is_default") is not True:
        alerts.append(
            alert(
                "DIRECT_RELATIONSHIP_GUARD_MISSING",
                "high",
                "Le contrat de souveraineté ne verrouille pas explicitement la relation directe par défaut.",
                REQUIRED_FILES["sovereignty"],
            )
        )

    masters = discover_master_surfaces(repo_root)

    relations = [
        {
            "type": "master_hierarchy",
            "path": MASTER_HIERARCHY,
            "rule": "La capacité métier reste derrière le professionnel et ne devient pas l'arbre public.",
        },
        {
            "type": "runtime_scope",
            "enabled_countries": enabled_countries,
            "disabled_countries": disabled_countries,
            "rule": "Un pays désactivé ou planned n'est jamais exposé par l'orchestrateur.",
        },
        {
            "type": "public_ai_gateway",
            "source": "DIGIY-MCP-V1",
            "tools": sorted(
                t.get("name")
                for t in tools
                if isinstance(t, dict) and isinstance(t.get("name"), str)
            ),
            "rule": "Le MCP reste la prise publique lecture seule; l'orchestrateur ne lui ajoute aucun droit.",
        },
        {
            "type": "need_capability_separation",
            "needs_count": len(need_ids),
            "capabilities_count": len(capability_ids),
            "rule": "Besoin visible et capacité technique restent deux couches distinctes.",
        },
        {
            "type": "master_surfaces",
            "count": len(masters),
            "items": masters,
            "rule": "Le survol observe les MASTER existants sans les fusionner.",
        },
    ]

    severity_weight = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    sorted_alerts = sorted(
        alerts,
        key=lambda a: (severity_weight.get(a["severity"], 9), a["code"]),
    )

    priorities: list[dict[str, Any]] = []
    rank = 1
    if any(a["code"] == "LEGACY_MARKET_REGISTERED" for a in sorted_alerts):
        priorities.append(
            {
                "rank": rank,
                "action": "Vérifier humainement l'alignement du registre capabilities.json avec la doctrine MARKET hors service / COMMERCE actif.",
                "write": False,
            }
        )
        rank += 1

    if any(a["severity"] == "critical" for a in sorted_alerts):
        priorities.append(
            {
                "rank": rank,
                "action": "Bloquer toute extension de l'orchestrateur jusqu'à résolution des gardes critiques.",
                "write": False,
            }
        )
        rank += 1

    priorities.append(
        {
            "rank": rank,
            "action": "Conserver la V1 en lecture seule et raccorder ensuite les adaptateurs de capacités un par un après validation humaine.",
            "write": False,
        }
    )

    status = "PASS"
    if any(a["severity"] == "critical" for a in sorted_alerts):
        status = "FAIL_CLOSED"
    elif any(a["severity"] in {"high", "medium"} for a in sorted_alerts):
        status = "PASS_WITH_ALERTS"

    return {
        "contract": "DIGIYLYFE-ORCHESTRATOR-SNAPSHOT-V1",
        "generated_at": utc_now(),
        "mode": "read-only",
        "status": status,
        "state": {
            "enabled_countries": enabled_countries,
            "disabled_countries": disabled_countries,
            "needs": need_ids,
            "capabilities": capability_ids,
            "mcp_mode": mcp.get("mode"),
            "mcp_tools_count": len(tools),
            "master_surfaces_count": len(masters),
        },
        "alerts": sorted_alerts,
        "relations": relations,
        "priorities": priorities,
    }


def main() -> int:
    parser = argparse.ArgumentParser(
        description="DIGIY ORCHESTRATOR V1 — audit global READ ONLY du MASTER."
    )
    parser.add_argument(
        "repo_root",
        nargs="?",
        default=".",
        help="Racine du dépôt digiy-master-modeles (défaut: dossier courant).",
    )
    parser.add_argument(
        "--output",
        help="Chemin optionnel où écrire le snapshot JSON.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Retourne un code non nul si une alerte high/critical existe.",
    )
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    snapshot = audit(repo_root)
    rendered = json.dumps(snapshot, ensure_ascii=False, indent=2)

    if args.output:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered + "\n", encoding="utf-8")

    print(rendered)

    if args.strict and any(
        a.get("severity") in {"critical", "high"}
        for a in snapshot.get("alerts", [])
    ):
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
