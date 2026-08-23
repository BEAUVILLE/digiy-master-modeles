/* DIGIYLYFE CORE RUNTIME V1
 * MASTER / atelier uniquement.
 * Aucun professionnel réel, aucun secret, aucune mutation de production.
 */

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function resolveUrl(baseUrl, relativePath) {
  return new URL(relativePath, baseUrl).href;
}

async function fetchJson(url, fetchImpl) {
  const res = await fetchImpl(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('CORE runtime: impossible de charger ' + url + ' (' + res.status + ')');
  return res.json();
}

function territoryGuardKey(slug) {
  return String(slug || '').replace(/-/g, '_');
}

function applyGuard(guard, territory, zones) {
  if (!guard) return zones;

  if (Array.isArray(guard.active_territories)) {
    assert(
      guard.active_territories.indexOf(territory.id) >= 0,
      'CORE runtime: territoire non autorisé par le garde géographique: ' + territory.id
    );
  }

  const localGuard = guard[territoryGuardKey(territory.slug)];
  if (!localGuard || !Array.isArray(localGuard.active_zones)) return zones;

  const allowed = new Set(localGuard.active_zones);
  return zones.filter(function (zone) {
    return allowed.has(zone.id);
  });
}

export async function loadDigiyCoreRuntime(options) {
  options = options || {};
  const fetchImpl = options.fetchImpl || fetch;
  const registryUrl = options.registryUrl;
  const countrySelector = options.country || 'SN';
  const territorySlug = options.territory;

  assert(registryUrl, 'CORE runtime: registryUrl requis');
  assert(territorySlug, 'CORE runtime: territory requis');

  const registryDoc = await fetchJson(registryUrl, fetchImpl);
  const countries = registryDoc.countries || [];
  const countryRef = countries.find(function (item) {
    return item.enabled === true && (item.id === countrySelector || item.slug === countrySelector);
  });

  assert(countryRef, 'CORE runtime: pays absent ou désactivé: ' + countrySelector);
  assert(countryRef.country_config, 'CORE runtime: country_config manquant');
  assert(countryRef.territories_config, 'CORE runtime: territories_config manquant');

  const countryUrl = resolveUrl(registryUrl, countryRef.country_config);
  const territoriesUrl = resolveUrl(registryUrl, countryRef.territories_config);
  const needsUrl = resolveUrl(registryUrl, registryDoc.needs_config || './needs.json');
  const guardUrl = countryRef.guard_config ? resolveUrl(registryUrl, countryRef.guard_config) : null;

  const loaded = await Promise.all([
    fetchJson(countryUrl, fetchImpl),
    fetchJson(territoriesUrl, fetchImpl),
    fetchJson(needsUrl, fetchImpl),
    guardUrl ? fetchJson(guardUrl, fetchImpl) : Promise.resolve(null)
  ]);

  const countryDoc = loaded[0];
  const territoriesDoc = loaded[1];
  const needsDoc = loaded[2];
  const guardDoc = loaded[3];
  const country = countryDoc.country;

  assert(country && country.id === countryRef.id, 'CORE runtime: incohérence country_id');
  assert(territoriesDoc.country_id === country.id, 'CORE runtime: territoires rattachés au mauvais pays');

  const territoryRef = (territoriesDoc.territories || []).find(function (item) {
    return item.slug === territorySlug;
  });

  assert(territoryRef, 'CORE runtime: territoire inconnu: ' + territorySlug);
  assert(territoryRef.status === 'active', 'CORE runtime: territoire non actif: ' + territorySlug);
  assert(territoryRef.master, 'CORE runtime: chemin MASTER territoire manquant: ' + territorySlug);

  const masterBase = resolveUrl(territoriesUrl, territoryRef.master);
  const territoryUrl = resolveUrl(masterBase, 'config/territory.json');
  const zonesUrl = resolveUrl(masterBase, 'config/zones.json');

  const territoryLoaded = await Promise.all([
    fetchJson(territoryUrl, fetchImpl),
    fetchJson(zonesUrl, fetchImpl)
  ]);

  const territory = territoryLoaded[0].territory;
  const zonesDoc = territoryLoaded[1];

  assert(territory && territory.id === territoryRef.id, 'CORE runtime: incohérence territory_id');
  assert(territory.country_id === country.id, 'CORE runtime: incohérence territory.country_id');
  assert(territory.status === 'active', 'CORE runtime: MASTER territoire non actif');
  assert(zonesDoc.territory_id === territory.id, 'CORE runtime: zones rattachées au mauvais territoire');

  let zones = (zonesDoc.zones || []).filter(function (zone) {
    return zone.status === 'active';
  });

  zones = applyGuard(guardDoc, territory, zones);

  const configuredActiveSlugs = new Set(territoryRef.zones || []);
  zones = zones.filter(function (zone) {
    return configuredActiveSlugs.has(zone.slug);
  });

  const needs = (needsDoc.needs || []).filter(function (need) {
    return need.status === 'core';
  });

  assert(zones.length > 0, 'CORE runtime: aucune zone active autorisée');
  assert(needs.length > 0, 'CORE runtime: aucun besoin CORE disponible');

  return {
    runtime: 'DIGIYLYFE-CORE-RUNTIME-V1',
    country: country,
    territory: territory,
    zones: zones,
    needs: needs,
    generic_professional_action: territory.generic_professional_action || 'OUVRIR',
    source_urls: {
      registry: registryUrl,
      country: countryUrl,
      territories: territoriesUrl,
      territory: territoryUrl,
      zones: zonesUrl,
      needs: needsUrl,
      guard: guardUrl
    }
  };
}

export function resolveDigiyZone(runtime, zoneSlug) {
  return (runtime.zones || []).find(function (zone) {
    return zone.slug === zoneSlug;
  }) || null;
}

export function resolveDigiyNeed(runtime, needId) {
  return (runtime.needs || []).find(function (need) {
    return need.id === needId;
  }) || null;
}
