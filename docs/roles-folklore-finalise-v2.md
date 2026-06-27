# Angano — Rôles & folklore malgache  
## Version finalisée V2 — Recommandations “Fady / Traces / Esprits”

> **Objectif de cette V2** : remplacer l’approche trop proche de *Loup-Garou* / *Cupidon* par une identité mécanique propre à **Angano**.  
> Recommandation principale : **supprimer la mécanique “amoureux” du MVP** et construire les rôles optionnels autour de trois signatures :  
> **fady**, **traces nocturnes**, **esprits des morts**.

---

## 0. Décision principale

### Ancienne direction à abandonner

```ts
cupidon -> lie 2 amoureux ; si l’un meurt, l’autre meurt.
```

Même si on le renomme en **Ranoro** ou **Zazavavindrano**, ce pouvoir reste trop reconnaissable.  
Il donne une impression de “copie thématisée” au lieu d’une vraie mécanique Angano.

### Nouvelle direction recommandée

```ts
zazavavindrano -> pose un fady d’eau sur un joueur.
Si une force hostile trouble ce fady, elle laisse une trace.
```

Le rôle ne crée plus de couple. Il crée un **piège d’information**.

C’est plus cohérent avec :
- les récits de pactes, interdits et fady ;
- les esprits d’eau ;
- la déduction sociale ;
- le besoin d’un pouvoir clair, résoluble côté serveur.

---

## 1. Piliers mécaniques d’Angano

Pour que le jeu ait une identité propre, les rôles doivent tourner autour de ces trois idées.

### 1.1 Fady

Un **fady** est un interdit temporaire posé sur un joueur, une cible ou une zone symbolique.

En gameplay :
- un joueur est marqué ;
- si une condition est violée, le serveur déclenche une conséquence ;
- la conséquence peut être une info, une annulation, une malédiction, ou un effet public.

Exemples :
- “si un Songomby cible ce joueur, Zazavavindrano apprend qu’une présence hostile est venue” ;
- “si trop d’actions ciblent le même joueur, Kokolampo bloque tout” ;
- “si un joueur maudit utilise son pouvoir, il échoue”.

### 1.2 Traces

Les rôles ne doivent pas toujours révéler directement une identité ou un rôle.  
Angano peut être plus intéressant si beaucoup d’informations sont partielles.

Exemples :
- “une présence hostile a troublé l’eau” ;
- “des pas inversés ont été trouvés” ;
- “un esprit a voté” ;
- “la cible a été visitée cette nuit”.

Cela crée un jeu moins binaire que “voyante = vérité absolue”.

### 1.3 Esprits des morts

Les morts ne doivent pas forcément devenir actifs tout le temps, sinon les parties deviennent chaotiques.  
Mais certains rôles peuvent donner **une dernière influence contrôlée** aux morts.

Exemples :
- Tromba donne un vote secret unique à un mort ;
- Lolo peut devenir un habillage narratif pour les spectateurs ;
- Fanany peut revenir une seule fois.

---

## 2. Grille finale recommandée

### 2.1 Cœur obligatoire MVP

Ces rôles forment la base stable, simple et lisible.

| id | Nom | Camp | Statut | Rôle |
|---|---|---:|---:|---|
| `mponina` | Mponina | Village | obligatoire | Aucun pouvoir, débat et vote. |
| `songomby` | Songomby | Songomby | obligatoire | Tue en meute la nuit. |
| `mpisikidy` | Mpisikidy | Village | recommandé dès 5–6 joueurs | Sonde un joueur. |
| `ombiasy` | Ombiasy | Village | recommandé dès 6 joueurs | 1 remède + 1 poison. |
| `mpihaza` | Mpihaza | Village | recommandé dès 6 joueurs | Tire une dernière flèche en mourant. |

### 2.2 Optionnels recommandés V2

Ce sont les rôles qui donnent une vraie identité à Angano.

| id | Nom | Camp | Joueurs conseillés | Fonction |
|---|---|---:|---:|---|
| `zazavavindrano` | Zazavavindrano | Village | 6+ | Fady d’eau / piège d’information. |
| `kalanoro` | Kalanoro | Village | 7+ | Traces inversées / discrétion. |
| `tromba` | Tromba | Village | 7+ | Mort qui vote une dernière fois. |
| `kinoly` | Kinoly | Songomby | 8+ | Imposteur qui paraît innocent. |
| `mpamosavy` | Mpamosavy | Songomby | 8+ | Maudit une action nocturne. |

### 2.3 Optionnels avancés

À activer quand le moteur est stable.

| id | Nom | Camp | Joueurs conseillés | Fonction |
|---|---|---:|---:|---|
| `kokolampo` | Kokolampo | Village | 9+ | Protège un lieu sacré si trop d’actions le troublent. |
| `fanany` | Fanany | Village ou neutre | 9+ | Survit / renaît une fois. |
| `trimobe` | Trimobe | Neutre hostile | 10+ | Dévoreur solitaire. |
| `lalomena` | Lalomena | Neutre ou village | 10+ | Colosse aquatique, survit à une première attaque. |

### 2.4 À éviter pour l’instant

Ces noms sont intéressants mais trop douteux, hors folklore malgache, ou à vérifier.

| Nom | Recommandation |
|---|---|
| `manananggal` | Ne pas intégrer : folklore philippin, pas malgache. |
| `bal_bal` | Ne pas intégrer : plutôt philippin / aswang-like. |
| `abyan` | Ne pas intégrer : esprit guide de traditions philippines. |
| `aprec` | Trop incertain, pas assez de base malgache solide. |
| `antsantsa` | À vérifier : peut évoquer requin / mer, mais le “serpent marin mythique” n’est pas assez solide. |
| `mamboly` | À éviter : en malgache, “mamboly” signifie planter/cultiver ; pour sorcier maléfique, préférer `mpamosavy`. |
| `vazimba` | À manier avec prudence : très important culturellement ; mieux en lore, narrateur ou mécanique sacrée tardive. |

---

## 3. Rôles retenus — Format technique

---

## 3.1 Mponina

```yaml
id: mponina
nameMg: Mponina
team: village
optional: false
desc: "Tu n’as aucun pouvoir nocturne. Observe, débat et vote pour chasser les monstres."
folklore_ref: "Mot descriptif malgache : habitant, résident."
```

### Lore

Les Mponina sont les habitants du village.  
Ils n’ont ni sort, ni vision, ni protection. Leur force vient de leur mémoire, de leur parole et de leur capacité à repérer les contradictions.

### Pouvoir

Aucun pouvoir actif.

```ts
power: {
  type: "none"
}
```

### Notes design

- À garder pour la lisibilité.
- Peut rester volontairement simple.
- Ne pas chercher à tout folkloriser : il faut des rôles neutres faciles à comprendre.

---

## 3.2 Songomby

```yaml
id: songomby
nameMg: Songomby
team: songomby
optional: false
desc: "Chaque nuit, les Songomby choisissent ensemble une victime à dévorer."
folklore_ref: "Bête monstrueuse nocturne du folklore malgache."
```

### Lore

On raconte qu’une bête passe la nuit autour des villages.  
Elle n’a pas besoin de convaincre : elle attend l’obscurité, puis elle frappe. Quand l’aube arrive, il ne reste que les traces.

### Pouvoir

Chaque nuit, les Songomby choisissent une victime commune.

```ts
power: {
  type: "pack_kill",
  phase: "night",
  target: "living_player",
  frequency: "every_night"
}
```

### Résolution serveur

1. Le serveur ouvre le tour des Songomby.
2. Les Songomby votent / sélectionnent une cible.
3. La cible est stockée dans `night.songombyTarget`.
4. La mort est résolue à l’aube, après protections, poisons, fady et annulations.

### Notes design

- Camp antagoniste principal.
- Condition de victoire inchangée : parité avec le village.
- Si `kinoly` est en jeu, il compte dans la parité Songomby.

---

## 3.3 Mpisikidy

```yaml
id: mpisikidy
nameMg: Mpisikidy
team: village
optional: false
desc: "Chaque nuit, tu consultes le sikidy pour découvrir le rôle d’un joueur."
folklore_ref: "Devin / praticien du sikidy."
```

### Lore

Le Mpisikidy lit les signes avant que le village ne les comprenne.  
Mais les esprits, les monstres et les traces inversées peuvent brouiller la vérité.

### Pouvoir

Chaque nuit, sonde le rôle d’un joueur.

```ts
power: {
  type: "inspect_role",
  phase: "night",
  target: "living_player",
  frequency: "every_night"
}
```

### Résolution serveur

- Résultat normal : rôle exact de la cible.
- Si la cible est `kinoly` : résultat conseillé = `mponina` ou `village`.
- Si la cible est sous effet `kalanoro_trace` : résultat = `trace_brouillee`.
- Si la cible est protégée par un effet spécial futur : appliquer le modificateur.

### Réponse UI possible

```txt
Le sikidy murmure : cette personne est Mpisikidy.
```

ou

```txt
Les signes sont brouillés. Des pas inversés traversent la lecture.
```

---

## 3.4 Ombiasy

```yaml
id: ombiasy
nameMg: Ombiasy
team: village
optional: false
desc: "Tu possèdes un remède et un poison, chacun utilisable une seule fois."
folklore_ref: "Guérisseur / devin / praticien traditionnel."
```

### Lore

L’Ombiasy connaît les plantes, les interdits et les remèdes.  
Mais son savoir est rare : une fois le remède donné ou le poison versé, il ne revient pas.

### Pouvoir

- 1 remède pour sauver la victime des Songomby.
- 1 poison pour tuer un joueur.

```ts
power: {
  type: "witch",
  phase: "night",
  heal_charges: 1,
  poison_charges: 1
}
```

### Résolution serveur

1. Après le choix des Songomby, le serveur informe l’Ombiasy de la victime.
2. Il peut utiliser le remède si disponible.
3. Il peut utiliser le poison si disponible.
4. Le serveur applique les morts à l’aube.

### Notes design

- Très fort : éviter de multiplier les rôles de protection autour de lui.
- Si `zazavavindrano` est activée, son pouvoir doit plutôt donner de l’information, pas sauver directement.

---

## 3.5 Mpihaza

```yaml
id: mpihaza
nameMg: Mpihaza
team: village
optional: false
desc: "Quand tu meurs, tu tires une dernière flèche sur le joueur de ton choix."
folklore_ref: "Chasseur, terme descriptif malgache."
```

### Lore

Le Mpihaza connaît la piste, l’odeur de la peur et le silence avant l’attaque.  
Même à terre, il garde une dernière flèche.

### Pouvoir

À sa mort, choisit un joueur vivant qui meurt avec lui.

```ts
power: {
  type: "death_shot",
  trigger: "on_death",
  target: "living_player",
  frequency: "once"
}
```

### Résolution serveur

- Déclenché sur mort par vote ou mort nocturne.
- Le serveur attend le choix du Mpihaza.
- Si délai expiré, possibilité de :
  - ne tuer personne ;
  - ou choisir aléatoirement parmi les vivants, déconseillé.
- La mort causée par le Mpihaza doit être annoncée séparément.

### Notes design

- Simple et satisfaisant.
- Garde son nom pour l’instant : lisible, facile à expliquer.

---

# 4. Nouveaux rôles signatures

---

## 4.1 Zazavavindrano — Fady d’Eau

```yaml
id: zazavavindrano
nameMg: Zazavavindrano
team: village
optional: true
desc: "Chaque nuit, tu poses un fady d’eau sur un joueur. Si une force hostile le trouble, elle laisse une trace."
folklore_ref: "Esprits / filles des eaux, Ranoro, pacte, fady, bénédiction et disparition."
```

### Pourquoi ce rôle remplace Cupidon

**Zazavavindrano ne doit pas lier deux amoureux.**

Le bon angle est :
- pacte ;
- interdit ;
- eau ;
- trace ;
- conséquence quand le tabou est brisé.

Cela donne une mécanique propre à Angano.

### Lore

Les Zazavavindrano vivent dans les eaux, les rivières et les lieux qu’on ne trouble pas impunément.  
Elles ne frappent pas toujours directement. Parfois, elles laissent seulement une trace sur celui qui a brisé le fady.

### Pouvoir recommandé

Chaque nuit, Zazavavindrano choisit un joueur vivant autre qu’elle-même.  
Ce joueur reçoit un **Fady d’Eau** jusqu’à l’aube.

Si une action hostile cible ce joueur pendant la nuit :
- l’action hostile se résout normalement ;
- Zazavavindrano reçoit une information privée à l’aube ;
- le serveur note qu’un fady a été brisé.

```ts
power: {
  type: "water_fady_trace",
  phase: "night",
  target: "living_player_except_self",
  frequency: "every_night",
  cannot_target_same_player_twice_in_row: true,
  effect: {
    mark_target_until_dawn: "fady_water",
    on_hostile_visit: "notify_zazavavindrano"
  }
}
```

### Définition d’une action hostile

Pour le moteur, une action hostile inclut :

```ts
type HostileAction =
  | "songomby_kill"
  | "kinoly_visit"
  | "mpamosavy_curse"
  | "trimobe_devour"
  | "future_hostile_power";
```

### Information reçue

Version équilibrée recommandée :

```txt
Le fady d’eau a été troublé. Une présence hostile a visité ta cible.
```

Version plus forte, à activer seulement si besoin :

```txt
Le fady d’eau a été brisé par [NomDuJoueur].
```

### Recommandation finale

Pour le MVP, choisir la version équilibrée :

```ts
reveal_mode: "hostile_presence_only"
```

Puis, si le rôle est trop faible en test :

```ts
reveal_mode: "one_hostile_visitor_identity"
```

### Résolution serveur

1. Zazavavindrano choisit une cible.
2. Le serveur ajoute un marqueur :

```ts
night.marks[targetId].push({
  type: "fady_water",
  ownerId: zazavavindranoId
});
```

3. Pendant la résolution, le serveur enregistre toutes les visites nocturnes :

```ts
night.visits.push({
  actorId,
  targetId,
  actionType,
  isHostile
});
```

4. À l’aube, si une visite hostile a touché la cible marquée :

```ts
sendPrivate(zazavavindranoId, {
  type: "fady_water_triggered",
  targetId,
  revealMode: "hostile_presence_only"
});
```

### Notes design

- Ne sauve pas directement.
- Ne copie pas Cupidon.
- Ne casse pas l’équilibre par trop de protections.
- Crée un “jeu de piège” très Angano.
- Se combine bien avec la Voyante sans la remplacer.

---

## 4.2 Kalanoro — Traces Inversées

```yaml
id: kalanoro
nameMg: Kalanoro
team: village
optional: true
desc: "Tu lis les pas dans la nuit. Certains avancent, d’autres reviennent à l’envers."
folklore_ref: "Petit esprit des forêts/eaux, souvent décrit avec des pieds inversés et des connaissances médicinales."
```

### Lore

Le Kalanoro ne suit pas les routes.  
Ses pieds regardent dans l’autre sens, et ceux qui cherchent sa piste finissent souvent par se perdre.

### Pouvoir recommandé

Chaque nuit, Kalanoro choisit un joueur vivant.  
À l’aube, il apprend si ce joueur a **visité quelqu’un** pendant la nuit.

Il ne connaît pas :
- la cible visitée ;
- le rôle ;
- le camp ;
- si l’action était bonne ou mauvaise.

```ts
power: {
  type: "track_activity",
  phase: "night",
  target: "living_player",
  frequency: "every_night",
  result: "did_target_visit_someone"
}
```

### Réponses UI

Si la cible a agi :

```txt
Des pas inversés ont été trouvés : cette personne a quitté sa place cette nuit.
```

Si la cible n’a pas agi :

```txt
Aucune trace claire : cette personne semble être restée immobile.
```

### Bonus optionnel — Cachette

Une fois par partie, Kalanoro peut se cacher.  
S’il est ciblé par une action hostile cette nuit-là, l’action échoue.

```ts
power_extra: {
  type: "stealth_hide",
  phase: "night",
  charges: 1,
  target: "self",
  effect: "avoid_first_hostile_action_this_night"
}
```

### Recommandation MVP

Pour éviter de trop complexifier, commencer sans le bonus cachette :

```ts
kalanoro_mode: "tracker_only"
```

Puis ajouter la cachette si le rôle paraît trop faible.

### Résolution serveur

1. Kalanoro choisit une cible.
2. Le serveur attend la fin de toutes les actions nocturnes.
3. Il vérifie dans `night.visits` si `actorId === targetId`.
4. Il envoie un résultat privé.

### Notes design

- Ne remplace pas Mpisikidy.
- Donne une info comportementale, pas une vérité de rôle.
- Très utile pour construire des accusations de jour.

---

## 4.3 Tromba — Voix des Morts

```yaml
id: tromba
nameMg: Tromba
team: village
optional: true
desc: "Une fois par partie, tu permets à un mort d’influencer le vote des vivants."
folklore_ref: "Possession / communication avec les esprits d’ancêtres."
```

### Lore

Quand les vivants parlent trop fort, les morts attendent.  
Le Tromba ouvre une porte, juste assez longtemps pour qu’un esprit pèse sur le destin du village.

### Pouvoir recommandé

Une fois par partie, pendant la nuit, Tromba choisit un joueur mort.  
Le lendemain, ce mort reçoit un **vote secret unique**.

```ts
power: {
  type: "dead_secret_vote",
  phase: "night",
  target: "dead_player",
  charges: 1,
  effect: "selected_dead_player_gets_secret_vote_next_day"
}
```

### Résolution serveur

1. Tromba choisit un mort.
2. Le serveur marque :

```ts
day.spiritVote = {
  deadPlayerId,
  sourceRole: "tromba",
  used: false
};
```

3. Pendant le vote de jour, le mort sélectionné peut voter secrètement.
4. Le vote est ajouté au total.
5. Le village voit seulement :

```txt
Un esprit a pesé dans le vote.
```

### Variante si les morts ne sont pas connectés

Si le joueur mort n’est plus en ligne :
- le pouvoir peut échouer ;
- ou le serveur peut permettre à Tromba de choisir directement une cible au moment de l’activation.

Recommandation :

```ts
fallback_if_dead_absent: "tromba_selects_secret_vote_target"
```

### Notes design

- Très original.
- Redonne un intérêt aux morts sans transformer la partie en chaos.
- À limiter à 1 fois par partie.

---

## 4.4 Kinoly — Imposteur Rouge

```yaml
id: kinoly
nameMg: Kinoly
team: songomby
optional: true
desc: "Tu comptes avec les Songomby, mais les signes te font paraître innocent."
folklore_ref: "Mort-vivant / esprit qui se mêle aux humains, yeux rouges, ongles longs."
```

### Lore

Le Kinoly marche parmi les vivants avec un visage presque ordinaire.  
Mais ceux qui regardent trop longtemps voient quelque chose de rouge derrière ses yeux.

### Pouvoir recommandé

Kinoly appartient au camp Songomby, compte pour la parité, mais apparaît comme Village aux investigations simples.

```ts
power: {
  type: "false_innocent",
  passive: true,
  seen_by_mpisikidy_as: "mponina",
  counts_for_victory_as: "songomby"
}
```

### Option avancée

Si tu veux lui donner un pouvoir actif plus tard :

```ts
power_extra: {
  type: "grave_mark",
  phase: "night",
  charges: 1,
  target: "living_player",
  effect: "target_appears_suspicious_to_tracker_or_fady_roles"
}
```

### Recommandation MVP

Ne pas lui donner d’action active au début.

```ts
kinoly_mode: "passive_impostor"
```

### Notes design

- Très bon ajout dès 8 joueurs.
- Force le village à ne pas dépendre uniquement de Mpisikidy.
- Attention : si trop de rôles brouillent l’info, le jeu devient frustrant.

---

## 4.5 Mpamosavy — Malédiction Nocturne

```yaml
id: mpamosavy
nameMg: Mpamosavy
team: songomby
optional: true
desc: "Chaque nuit, tu maudis un joueur : son pouvoir nocturne échoue."
folklore_ref: "Sorcier·e maléfique / jeteur de sorts."
```

### Lore

Le Mpamosavy n’a pas besoin de tuer.  
Il lui suffit de souffler sur une décision, de détourner un remède, ou d’éteindre une vision.

### Pouvoir recommandé

Chaque nuit, choisit un joueur.  
Si ce joueur utilise un pouvoir nocturne actif, ce pouvoir échoue.

```ts
power: {
  type: "roleblock",
  phase: "night",
  target: "living_player",
  frequency: "every_night",
  cannot_target_same_player_twice_in_row: true,
  cannot_block_songomby_pack_kill: true
}
```

### Cibles affectées

Le blocage peut affecter :
- `mpisikidy`;
- `ombiasy`;
- `zazavavindrano`;
- `kalanoro`;
- `tromba`;
- `kokolampo`;
- tout futur rôle nocturne actif.

### Cibles non affectées

Ne bloque pas :
- le vote de jour ;
- le tir du Mpihaza à la mort ;
- la mort par Songomby ;
- les passifs comme `kinoly`.

### Résolution serveur

1. Mpamosavy choisit une cible.
2. Le serveur ajoute :

```ts
night.blocks.push({
  actorId: mpamosavyId,
  targetId,
  source: "mpamosavy"
});
```

3. Lors de chaque action nocturne, le serveur vérifie si l’acteur est bloqué.
4. Si oui, l’action ne produit aucun effet.

### Message UI au joueur bloqué

```txt
Une malédiction a brouillé ton pouvoir cette nuit.
```

### Notes design

- Très fort contre les rôles info.
- À introduire seulement quand le village a assez de rôles actifs.
- Pas avant 8 joueurs.

---

# 5. Rôles avancés

---

## 5.1 Kokolampo — Gardien du Lieu Sacré

```yaml
id: kokolampo
nameMg: Kokolampo
team: village
optional: true
desc: "Tu protèges un lieu sacré. Si trop de forces le troublent, le fady se referme."
folklore_ref: "Esprit d’ancêtre ou de forêt associé à certains lieux sacrés, notamment des arbres."
```

### Lore

Certains lieux ne doivent pas être approchés.  
Pas parce qu’ils sont vides, mais parce que quelque chose y veille.

### Pouvoir recommandé

Chaque nuit, Kokolampo choisit un joueur comme **lieu sacré**.  
Si deux actions ou plus ciblent ce joueur pendant la nuit, toutes les actions sur ce joueur échouent.

```ts
power: {
  type: "sacred_site_barrier",
  phase: "night",
  target: "living_player",
  frequency: "every_night",
  trigger: "target_receives_two_or_more_visits",
  effect: "cancel_all_actions_targeting_marked_player",
  charges_successful_trigger: 1
}
```

### Règle importante

Le pouvoir ne peut se déclencher avec succès qu’une fois par partie.

Après déclenchement :

```ts
kokolampo.hasTriggered = true;
```

Il peut ensuite continuer à voter, mais n’a plus de pouvoir.

### Résolution serveur

1. Kokolampo marque une cible.
2. Le serveur compte toutes les visites reçues par cette cible.
3. Si `visitsToTarget.length >= 2`, le fady se déclenche.
4. Toutes les actions visant cette cible sont annulées.
5. À l’aube, message public :

```txt
Un lieu sacré a été troublé cette nuit. Le fady s’est refermé.
```

### Notes design

- Très original.
- Peut annuler une attaque, une enquête ou un poison.
- À garder pour parties avancées, car l’ordre de résolution devient plus subtil.

---

## 5.2 Fanany — Mue du Serpent

```yaml
id: fanany
nameMg: Fanany
team: village
optional: true
desc: "La première fois que tu devrais mourir de nuit, tu mues et survis."
folklore_ref: "Serpent / réincarnation liée au corps d’un défunt noble selon certaines traditions."
```

### Lore

Le Fanany ne revient pas comme un humain revient.  
Il mue, laisse une peau derrière lui, et le village comprend qu’une ancienne force vient de bouger.

### Pouvoir recommandé

La première fois que Fanany devrait mourir pendant la nuit, il survit.

```ts
power: {
  type: "one_night_death_shield",
  passive: true,
  trigger: "would_die_at_night",
  charges: 1,
  effect: "prevent_death"
}
```

### Limites

Fanany meurt normalement :
- au vote de jour ;
- par tir du Mpihaza ;
- par condition spéciale future ;
- à la deuxième attaque nocturne.

### Message d’aube

```txt
Une peau vide a été trouvée au matin. Quelqu’un a échappé à la mort.
```

### Notes design

- Simple à coder.
- Peut rallonger la partie, mais seulement une fois.
- Mieux en village qu’en neutre pour le MVP.

---

## 5.3 Trimobe — Dévoreur Solitaire

```yaml
id: trimobe
nameMg: Trimobe
team: neutre
optional: true
desc: "Tu dévores dans l’ombre. Tu gagnes si tu finis seul ou parmi les deux derniers."
folklore_ref: "Ogre dévoreur des contes."
```

### Lore

Trimobe ne chasse pas pour un camp.  
Il mange ce qui reste quand les autres ont fini de s’accuser.

### Pouvoir recommandé

Trimobe est un tueur neutre.  
Il ne tue pas la première nuit. Ensuite, il peut tuer une nuit sur deux.

```ts
power: {
  type: "neutral_kill",
  phase: "night",
  target: "living_player",
  starts_on_night: 2,
  cooldown_nights: 1
}
```

### Condition de victoire

```ts
win_condition: {
  type: "last_survivor_or_final_two",
  team: "neutre"
}
```

### Notes design

- À éviter en dessous de 10 joueurs.
- Peut rendre les parties très mortelles.
- Bon rôle “mode chaos” pour lobby avancé.

---

## 5.4 Lalomena — Bête Rouge des Eaux

```yaml
id: lalomena
nameMg: Lalomena
team: village
optional: true
desc: "La première attaque contre toi échoue, mais le village apprend qu’une bête rouge a remué les eaux."
folklore_ref: "Bête rouge aquatique légendaire, parfois associée à des cornes rouges."
```

### Pouvoir recommandé

Lalomena survit à la première attaque directe qui devrait le tuer, de jour ou de nuit.

```ts
power: {
  type: "first_death_shield",
  passive: true,
  charges: 1,
  trigger: "would_die",
  effect: "prevent_death_and_public_reveal"
}
```

### Message public

```txt
La bête rouge a résisté. Lalomena a survécu à une première mort.
```

### Notes design

- Très fort car il survit aussi au vote si on le permet.
- Recommandation : pour équilibrer, limiter à la nuit uniquement.
- Si Fanany existe déjà, éviter d’activer Lalomena dans la même partie.

---

# 6. Rôles à garder en lore / non recommandés pour le moteur

---

## 6.1 Vazimba

```yaml
id: vazimba
nameMg: Vazimba
status: lore_only_for_now
```

### Recommandation

Ne pas en faire un rôle actif au début.

Les Vazimba sont trop importants culturellement et symboliquement pour être réduits à un “pouvoir de jeu” vite fait.  
Ils peuvent plutôt servir à :
- nommer une phase ;
- inspirer un mode de narration ;
- créer un événement rare ;
- représenter un lieu sacré ;
- enrichir les textes d’ambiance.

### Usage possible plus tard

```ts
event: "vazimba_vision"
effect: "le village reçoit un indice public flou"
frequency: "rare"
```

---

## 6.2 Lolo / Angatra

```yaml
id: lolo
nameMg: Lolo
status: spectator_lore
```

### Recommandation

Utiliser les `lolo` comme habillage pour les joueurs morts.

Exemples :
- interface spectateur ;
- réactions visuelles ;
- animation de vote spirituel si Tromba agit ;
- ambiance audio.

Éviter de donner un pouvoir permanent à tous les morts.

---

## 6.3 Antsantsa / Tompondrano

L’idée d’un esprit ou serpent d’eau est intéressante, mais `antsantsa` est à vérifier.  
Pour un rôle aquatique, préférer pour l’instant :
- `zazavavindrano`;
- `lalomena`;
- éventuellement `tompondrano` plus tard si l’équipe valide les sources.

---

# 7. Ordre de résolution serveur recommandé

La logique doit rester server-authoritative.

## 7.1 Phase Nuit

Ordre conseillé :

1. **Début de nuit**
   - reset `night.visits`
   - reset `night.marks`
   - reset `night.blocks`
   - reset `night.pendingDeaths`

2. **Pose des marques**
   - Zazavavindrano pose `fady_water`
   - Kokolampo pose `sacred_site`
   - autres futurs marqueurs

3. **Blocages**
   - Mpamosavy choisit une cible à bloquer
   - enregistrer le blocage

4. **Actions d’information**
   - Mpisikidy choisit une cible
   - Kalanoro choisit une cible
   - si bloqué, résultat annulé ou brouillé

5. **Actions de mort**
   - Songomby choisissent leur victime
   - Trimobe choisit sa victime si actif
   - Ombiasy poison si utilisé

6. **Sauvetages / annulations**
   - Ombiasy remède
   - Fanany mue
   - Lalomena bouclier
   - Kokolampo fady de lieu sacré si condition remplie

7. **Détection des traces**
   - Zazavavindrano reçoit info si fady d’eau brisé
   - Kalanoro reçoit info sur l’activité de sa cible

8. **Aube**
   - appliquer morts finales
   - révéler rôles morts
   - déclencher Mpihaza si mort
   - annoncer événements publics

---

## 7.2 Structure de données suggérée

```ts
type RoleId =
  | "mponina"
  | "songomby"
  | "mpisikidy"
  | "ombiasy"
  | "mpihaza"
  | "zazavavindrano"
  | "kalanoro"
  | "tromba"
  | "kinoly"
  | "mpamosavy"
  | "kokolampo"
  | "fanany"
  | "trimobe"
  | "lalomena";

type Team = "village" | "songomby" | "neutre";

type NightVisit = {
  actorId: string;
  targetId: string;
  actionType: string;
  isHostile: boolean;
};

type NightMark =
  | {
      type: "fady_water";
      ownerId: string;
      targetId: string;
    }
  | {
      type: "sacred_site";
      ownerId: string;
      targetId: string;
    };

type NightBlock = {
  actorId: string;
  targetId: string;
  source: "mpamosavy";
};

type PendingDeath = {
  targetId: string;
  cause:
    | "songomby"
    | "poison"
    | "trimobe"
    | "mpihaza"
    | "vote"
    | "other";
  sourceId?: string;
  canBePrevented: boolean;
};
```

---

## 7.3 Résolution simplifiée

```ts
function resolveNight(room: RoomState) {
  resetNightState(room);

  collectMarks(room);       // Zazavavindrano, Kokolampo
  collectBlocks(room);      // Mpamosavy
  collectInfoActions(room); // Mpisikidy, Kalanoro
  collectKillActions(room); // Songomby, Trimobe, poison

  applyRoleblocks(room);
  recordVisits(room);

  applySacredSiteBarriers(room);
  applyHealsAndShields(room);

  resolveDeaths(room);
  resolveTraceNotifications(room);

  startDawn(room);
}
```

---

# 8. Équilibrage par nombre de joueurs

## 4–5 joueurs

Très petit format.  
Éviter trop de pouvoirs.

```txt
1 Songomby
1 Mpisikidy ou Ombiasy
reste Mponina
```

Pas de Zazavavindrano, pas de Tromba.

---

## 6 joueurs

Premier vrai format Angano.

```txt
1 Songomby
1 Mpisikidy
1 Ombiasy
1 Zazavavindrano
2 Mponina
```

Option : remplacer Ombiasy par Mpihaza si les parties durent trop.

---

## 7 joueurs

```txt
1 Songomby
1 Mpisikidy
1 Ombiasy
1 Zazavavindrano
1 Kalanoro
2 Mponina
```

ou

```txt
1 Songomby
1 Mpisikidy
1 Ombiasy
1 Tromba
1 Mpihaza
2 Mponina
```

---

## 8 joueurs

Début des rôles maléfique avancés.

```txt
2 Songomby
1 Mpisikidy
1 Ombiasy
1 Zazavavindrano
1 Kalanoro
1 Mpihaza
1 Mponina
```

ou avec Kinoly :

```txt
1 Songomby
1 Kinoly
1 Mpisikidy
1 Ombiasy
1 Zazavavindrano
1 Mpihaza
2 Mponina
```

---

## 9 joueurs

```txt
2 Songomby
1 Mpisikidy
1 Ombiasy
1 Zazavavindrano
1 Kalanoro
1 Tromba
1 Mpihaza
1 Mponina
```

Option avancée :

```txt
2 Songomby
1 Mpamosavy
1 Mpisikidy
1 Ombiasy
1 Zazavavindrano
1 Kalanoro
2 Mponina
```

---

## 10–12 joueurs

```txt
2 Songomby
1 Kinoly ou Mpamosavy
1 Mpisikidy
1 Ombiasy
1 Zazavavindrano
1 Kalanoro
1 Tromba
1 Mpihaza
reste Mponina
```

Mode chaos :

```txt
2 Songomby
1 Mpamosavy
1 Trimobe
1 Mpisikidy
1 Ombiasy
1 Zazavavindrano
1 Kalanoro
1 Tromba
reste Mponina
```

---

# 9. Recommandations de lobby

Chaque rôle optionnel doit pouvoir être activé/désactivé.

```ts
type RoleConfig = {
  enabledRoles: RoleId[];
  minPlayers: number;
  maxPlayers: number;
  allowAdvancedRoles: boolean;
};
```

## Presets conseillés

### Preset 1 — Classic Angano

```ts
[
  "mponina",
  "songomby",
  "mpisikidy",
  "ombiasy",
  "mpihaza"
]
```

### Preset 2 — Fady & Traces

```ts
[
  "mponina",
  "songomby",
  "mpisikidy",
  "ombiasy",
  "mpihaza",
  "zazavavindrano",
  "kalanoro"
]
```

### Preset 3 — Esprits

```ts
[
  "mponina",
  "songomby",
  "mpisikidy",
  "ombiasy",
  "zazavavindrano",
  "tromba",
  "mpihaza"
]
```

### Preset 4 — Nuit dangereuse

```ts
[
  "mponina",
  "songomby",
  "kinoly",
  "mpamosavy",
  "mpisikidy",
  "ombiasy",
  "zazavavindrano",
  "kalanoro",
  "mpihaza"
]
```

### Preset 5 — Chaos avancé

```ts
[
  "mponina",
  "songomby",
  "kinoly",
  "mpamosavy",
  "trimobe",
  "mpisikidy",
  "ombiasy",
  "zazavavindrano",
  "kalanoro",
  "tromba",
  "kokolampo",
  "fanany"
]
```

---

# 10. Conditions de victoire V2

## Village

Le Village gagne si tous les joueurs du camp Songomby et les neutres hostiles sont morts.

```ts
villageWinsIf:
  aliveSongombyCount === 0 && aliveNeutralHostileCount === 0
```

## Songomby

Les Songomby gagnent s’ils atteignent la parité avec les non-Songomby, hors neutres hostiles selon configuration.

```ts
songombyWinsIf:
  aliveSongombyCount >= aliveNonSongombyNonNeutralHostileCount
```

## Neutres hostiles

Exemple Trimobe :

```ts
trimobeWinsIf:
  trimobeAlive && alivePlayers.length <= 2
```

## Suppression recommandée

Retirer pour l’instant :

```ts
loversWinCondition
```

La condition “amoureux” peut revenir plus tard dans un mode spécial, mais elle ne doit pas être au cœur d’Angano.

---

# 11. Textes courts UI

## Zazavavindrano

```txt
Tu poses un fady d’eau sur un joueur. Si une force hostile le trouble, tu sentiras sa trace.
```

## Kalanoro

```txt
Tu lis les pas de la nuit. Tu sais si ta cible a quitté sa place.
```

## Tromba

```txt
Une fois par partie, tu appelles un mort pour qu’il pèse secrètement sur le vote.
```

## Kinoly

```txt
Tu comptes avec les Songomby, mais les signes te font paraître innocent.
```

## Mpamosavy

```txt
Chaque nuit, tu maudis un joueur pour faire échouer son pouvoir.
```

## Kokolampo

```txt
Tu protèges un lieu sacré. Si trop de forces le troublent, le fady se referme.
```

## Fanany

```txt
La première fois que la nuit devrait t’emporter, tu mues et survis.
```

## Trimobe

```txt
Tu dévores seul. Tu gagnes si tu survis jusqu’à la fin.
```

---

# 12. Phrases d’ambiance Narrateur

## Fady d’eau déclenché

```txt
Cette nuit, l’eau n’est pas restée calme. Quelqu’un a troublé un interdit.
```

## Traces inversées

```txt
Au matin, des pas étranges entourent le village. Ils semblent aller dans deux directions à la fois.
```

## Vote d’esprit

```txt
Au moment du vote, une voix qui n’appartient plus aux vivants s’est fait entendre.
```

## Malédiction

```txt
Une parole noire a traversé la nuit. Un pouvoir s’est éteint avant d’agir.
```

## Lieu sacré

```txt
Un lieu sacré a été approché de trop près. Le fady s’est refermé.
```

## Fanany

```txt
On a trouvé une peau vide à l’aube. Quelqu’un aurait dû mourir, mais la nuit l’a laissé passer.
```

---

# 13. Roadmap d’implémentation

## Étape 1 — Retirer Cupidon / amoureux

À faire :
- retirer `cupidon` des rôles par défaut ;
- retirer ou désactiver la condition de victoire amoureux ;
- garder le code en archive si besoin pour mode spécial futur.

## Étape 2 — Ajouter Zazavavindrano

Priorité haute.

À coder :
- rôle ;
- action nocturne ciblée ;
- marqueur `fady_water`;
- tracking des visites ;
- message privé à l’aube.

## Étape 3 — Ajouter Kalanoro

Priorité haute.

À coder :
- rôle ;
- action nocturne ciblée ;
- lecture de `night.visits`;
- réponse `did_visit` / `did_not_visit`.

## Étape 4 — Ajouter Kinoly

Priorité moyenne.

À coder :
- rôle Songomby ;
- apparence modifiée à la voyante ;
- comptage parité.

## Étape 5 — Ajouter Tromba

Priorité moyenne.

À coder :
- sélection d’un mort ;
- vote secret de mort ;
- fallback si le mort n’est pas connecté.

## Étape 6 — Ajouter Mpamosavy

Priorité moyenne/avancée.

À coder :
- roleblock ;
- gestion des actions bloquées ;
- UI de malédiction.

## Étape 7 — Ajouter Kokolampo/Fanany/Trimobe

Priorité basse, après playtests.

---

# 14. Verdict final

La V2 recommandée pour Angano est :

```txt
Supprimer Cupidon.
Ne pas remplacer Cupidon par un autre Cupidon.
Transformer Zazavavindrano en rôle de fady / trace.
Faire de Kalanoro un pisteur de mouvements.
Faire de Tromba une mécanique contrôlée des morts.
Garder Kinoly/Mpamosavy pour renforcer le camp Songomby.
```

Le cœur d’Angano devient donc :

```txt
FADY + TRACES + ESPRITS
```

Et non :

```txt
LOUP-GAROU + SKINS MALGACHES
```

C’est cette direction qui donne au jeu sa vraie identité.

---

# 15. Sources / bases folklore à conserver

Sources déjà présentes dans le brief initial :
- Zazavavindrano — https://voyage-madagascar.org/zazavavindrano-sirenes-malgaches/
- Filles des eaux — https://www.vol-direct.net/tout-savoir-sur-les-zazavavindrano-ou-les-filles-des-eaux.html
- Légende betsimisaraka des Zazavavindrano — https://lemurie.over-blog.com/2015/07/la-legende-betsimisaraka-des-zazavavindrano.html
- Ranoro — https://www.madamagazine.com/en/ranoro-die-tochter-des-wassers/
- Kalanoro — https://en.wikipedia.org/wiki/Kalanoro
- Sainte Kalanoro — https://journals.openedition.org/jda/5886?lang=en
- Malagasy mythology — https://en.wikipedia.org/wiki/Malagasy_mythology
- Monstres de Madagascar — https://randriamialy.mondoblog.org/2014/07/05/legendes-de-madagascar-les-monstres/
- Personnages des contes — https://randriamialy.mondoblog.org/2014/07/08/contes-legendes-de-madagascar-les-personnages/
- Ibonia — https://en.wikipedia.org/wiki/Ibonia

Sources complémentaires utiles :
- Kalanoro, forêt, rêves, plantes médicinales — https://www.madamagazine.com/en/die-kleinen-waldgeister-kalanoro/
- Tromba / possession d’ancêtres — https://publishing.cdlib.org/ucpressebooks/view?brand=ucpress&chunk.id=d0e2874&docId=ft6t1nb4hz&toc.depth=1&toc.id=d0e2874
- Kokolampo, baobabs, fady — https://news.mongabay.com/2021/05/in-madagascar-cultural-taboos-can-protect-or-harm-the-environment/
- Songomby — https://abookofcreatures.com/2020/04/24/songomby/
- Vazimba — https://www.vivytravel.com/malagasy-lexicon-who-are-the-vazimba/
- Fanany / serpent / réincarnation — https://archive.org/download/serpentworshipin211hamb/serpentworshipin211hamb.pdf
- Manananggal, à exclure car philippin — https://en.wikipedia.org/wiki/Manananggal
- Bal-Bal, à exclure car philippin — https://en.wikipedia.org/wiki/Bal-Bal
- Abyan, à exclure car philippin — https://en.wikipedia.org/wiki/Filipino_shamans

---

# 16. Prompt court pour Codex / agent dev

```txt
Agis comme un dev senior TypeScript temps réel. Patch minimal, diff applicable.

Objectif : mettre à jour Angano pour supprimer la mécanique Cupidon/amoureux et intégrer la V2 des rôles folklore.

Priorités :
1. Désactiver/retirer Cupidon des rôles par défaut.
2. Ajouter le rôle `zazavavindrano` avec pouvoir `water_fady_trace`.
3. Ajouter tracking serveur des visites nocturnes `night.visits`.
4. Ajouter notifications privées à l’aube si un fady d’eau est troublé.
5. Ajouter `kalanoro` comme pisteur simple : apprend si sa cible a visité quelqu’un.
6. Préparer les types pour `kinoly`, `tromba`, `mpamosavy`, sans forcément tout activer dans le MVP.
7. Garder le serveur autoritatif : aucun rôle secret envoyé aux clients non autorisés.

Contraintes :
- Ne casse pas le lobby existant.
- Les rôles restent activables/désactivables.
- Toute logique de mort, vote, victoire et rôle doit rester côté serveur.
- Ajouter des tests unitaires pour la résolution de nuit si le projet en possède déjà.
```
