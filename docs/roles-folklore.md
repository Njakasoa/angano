# Angano — Rôles & folklore malgache (document de travail)

> **But de ce fichier** : servir de brief à un LLM spécialisé (folklore / mythologie
> malgache, game design de jeux de déduction) pour **finaliser la grille de rôles**
> d'Angano. Il contient (1) le contexte du jeu et ses contraintes techniques, (2) la
> grille de rôles actuelle, (3) la recherche folklore déjà faite, (4) les pistes de
> rôles/pouvoirs, (5) les questions ouvertes à trancher. **Modifie / complète ce
> fichier**, puis renvoie-le : il sera utilisé pour mettre à jour le code
> (`roles.ts` serveur + miroir client + moteur `room.ts`).

---

## 1. Contexte du projet

**Angano** (= « conte / légende » en malgache) est un **jeu de déduction sociale
multijoueur en ligne** façon loup-garou / mafia (mécaniques génériques, domaine
public), à thème **folklore malgache**. Déployé sur `angano.njakasoa.xyz`.

- **Server-authoritatif** : un backend (core-api, WebSocket) attribue les rôles
  secrets et résout TOUTE la logique (morts, votes, victoire). Aucun rôle/secret
  n'est jamais envoyé à un client qui n'y a pas droit → **anti-triche par
  construction**.
- **Narrateur** : un siège dédié (ne joue pas) qui voit tout, lance l'ambiance
  audio/visuelle et rythme les phases. C'est le serveur qui décide ; le narrateur
  ne fait que raconter/cadencer.
- **Boucle de partie** : Lobby → attribution secrète → **Nuit** (les rôles agissent
  l'un après l'autre) → **Aube** (annonce des morts + rôle révélé, chaînes) →
  **Jour** (débat minuté → vote → élimination) → re-boucle jusqu'à une victoire.
- **Effectif** : narrateur + **4–5 joueurs minimum** (idéalement 6–12).

### Conditions de victoire (actuelles)
- **Village** gagne si tous les Songomby (monstres) sont morts.
- **Songomby** gagnent s'ils atteignent la **parité** avec le village.
- **Amoureux** (si Cupidon en jeu) : gagnent s'il ne reste qu'eux deux.

### Contraintes de game design (important pour les propositions)
1. **Chaque rôle doit avoir un pouvoir clair et résoluble côté serveur** : une
   action ciblée la nuit (choisir 1 joueur), un pouvoir passif (déclenché à la mort,
   à l'attaque…), ou un pouvoir de jour (vote spécial). Éviter les pouvoirs « sociaux »
   non vérifiables par le serveur.
2. **Équilibrage par camps** : garder une majorité Village, 1+ Songomby, et
   éventuellement des **neutres** (objectif propre). Pas trop de rôles qui annulent
   la mort (sinon parties interminables).
3. **Lisibilité** : le nom malgache doit être évocateur, mais le pouvoir doit être
   compréhensible vite (carte de rôle = nom + 1 phrase de description).
4. **Modularité** : les rôles optionnels sont activables/désactivables dans le lobby
   (config de l'hôte). Le MVP tourne déjà avec ce système.
5. **Assets** : visuels (images de phase) et audio d'ambiance sont pour l'instant des
   **placeholders recyclés** d'une ancienne app. Les vrais visuels « monstres du
   folklore malgache » viendront plus tard → on peut choisir librement les créatures,
   l'art suivra.

---

## 2. Grille de rôles ACTUELLE (MVP, en production)

| id | Nom (malgache) | Équivalent classique | Équipe | Pouvoir |
|---|---|---|---|---|
| `mponina` | **Mponina** | Villageois | Village | Aucun. Débat et vote le jour. |
| `songomby` | **Songomby** | Loup-garou | Songomby | Chaque nuit, dévore une victime en meute. |
| `mpisikidy` | **Mpisikidy** | Voyante | Village | Chaque nuit, sonde le rôle d'un joueur (privé). |
| `ombiasy` | **Ombiasy** | Sorcière | Village | 1 remède (sauver la victime) + 1 poison (tuer), 1× chacun. |
| `cupidon` | **Cupidon** ⚠️ | Cupidon | Village | 1re nuit : lie 2 amoureux. Si l'un meurt, l'autre suit. |
| `mpihaza` | **Mpihaza** | Chasseur | Village | En mourant, emporte un joueur (dernière flèche). |

**Verdict d'authenticité :**
- ✅ **Songomby**, **Mpisikidy**, **Ombiasy** = vrai vocabulaire/folklore malgache, solides.
- 🟡 **Mponina** (« habitant »), **Mpihaza** (« chasseur ») = littéraux/descriptifs, corrects mais peu folkloriques.
- ⚠️ **Cupidon** = **non malgache**, à remplacer (déclencheur de ce document).

---

## 3. Recherche folklore (déjà effectuée)

Sources en bas de document.

### Créatures & figures relevées
- **Songomby** — bête monstrueuse nocturne dévoreuse (parfois équine/bovine, oreilles
  d'âne). *(déjà = le monstre)*
- **Zazavavindrano** (« filles des eaux ») — sirènes / esprits d'eau **bienveillants**,
  **matriarcaux**. Apportent **prospérité, santé, vertu, protection** à qui gagne leur
  amour/amitié ; scellent un **pacte de mariage** sous un **fady** (interdit, ex. le
  « sel ») ; pacte rompu → la sirène **disparaît et emporte tout** (mort/ruine). Se
  **déguisent en humains le jour**.
- **Ranoro** — *Zazavavindrano* nommée d'une légende d'amour culte des Hautes Terres
  (pacte d'amour à condition mortelle : ne pas dire « sel »).
- **Kalanoro** — petit être humanoïde des eaux/forêts ; poilu, yeux rouges, ongles
  longs, **pieds inversés**, mange cru, solitaire. **Mais** dans d'autres traditions,
  une **« sainte kalanoro »** bienveillante qui **initie les guérisseurs**. (Ambivalent.)
- **Kinoly** — type d'*angatra* : ressemble aux gens mais **yeux rouges, ongles longs**,
  **éventre les vivants** ; **se mêle aux humains**. (Mort-vivant/goule.)
- **Angatra** — fantômes / esprits des morts.
- **Lolo / Lolorano** — âmes des morts (papillons/esprits) ; les *Lolorano*
  **possèdent de jeunes filles** (âmes d'anciens rois).
- **Tromba** — médiumnité par **possession** d'un esprit d'ancêtre (transe).
- **Trimobe / Itrimobe** — **ogre** qui dévore (surtout les enfants), souvent berné dans les contes.
- **Mpamosavy** — **sorcier·e maléfique** (danse nue la nuit sur les tombes ; jette des sorts).
- **Fanany** — **serpent/anguille qui renaît du corps** d'un défunt noble (réincarnation).
- **Lalomena** — **bête rouge légendaire des eaux**, rare, puissante (cornes-trésor).
- **Fosa** (fossa) — prédateur réel devenu figure de conte.
- **Ibonia** — **héros épique** par excellence (quête pour récupérer sa promise).
- **Zanahary / Andriamanitra** — divinités créatrices ; **razana** = ancêtres protecteurs.

---

## 4. Pistes de rôles & pouvoirs (à challenger)

> Statut au moment de l'écriture : l'utilisateur trouve les propositions « pas très
> convaincantes » mais voit une **piste intéressante**. Le rôle Cupidon est le point
> de départ ; il est **ouvert à donner au Zazavavindrano un AUTRE pouvoir** que le
> simple lien d'amoureux. **À retravailler par le LLM spécialisé.**

### 4.a — Remplacer « Cupidon » : options de pouvoir pour le Zazavavindrano
| Option | Mécanique | Inspiration |
|---|---|---|
| **A. Pacte d'amour** (= Cupidon actuel) | 1re nuit, lie 2 amoureux liés par la mort. | Mariage scellé par le fady. |
| **B. Bénédiction / protection** | Chaque nuit, protège 1 joueur de la mort (garde du corps). | « apporte santé et protection ». |
| **C. Le fady (interdit)** | Pose un tabou sur 1 joueur : conséquence spéciale s'il est visé/voté (sauvé 1×, ou se retourne). | Le tabou sacré qui lie et punit. |
| **D. Déguisement diurne** | (variante maléfique) apparaît « innocent » à la voyante. | Se mêle aux humains le jour. |

### 4.b — Bestiaire → rôles (menu complet)
**Camp Village (gentils)**
| Créature | Trait folklore | Pouvoir proposé |
|---|---|---|
| Mpisikidy ✓ | Devin du *sikidy*. | Sonde un rôle la nuit. |
| Ombiasy ✓ | Guérisseur traditionnel. | Remède + poison. |
| **Kalanoro** | « Sainte kalanoro » initiatrice des guérisseurs. | **Protecteur** : met un joueur à l'abri des Songomby chaque nuit. |
| **Zazavavindrano** | Esprit d'eau bienveillant. | Voir 4.a (reco : protection ou amoureux). |
| **Tromba** | Médiumnité par possession. | **Médium** : communie avec un mort → apprend son rôle/camp. |

**Camp Songomby / maléfique**
| Créature | Trait folklore | Pouvoir proposé |
|---|---|---|
| Songomby ✓ | Bête dévoreuse nocturne. | Tue en meute la nuit. |
| **Kinoly** | *Angatra* yeux rouges qui éventre mais se mêle aux gens. | **Imposteur** : compte avec les Songomby, apparaît « innocent » à la voyante. |
| **Mpamosavy** | Sorcier·e maléfique nocturne. | **Maudit** : annule/retourne un pouvoir une nuit. |
| **Trimobe** | Ogre dévoreur. | **Dévoreur solitaire** : 2e tueur indépendant (parties à +joueurs). |

**Neutres / spéciaux**
| Créature | Trait folklore | Pouvoir proposé |
|---|---|---|
| **Fanany** | Serpent qui renaît d'un défunt. | **Revenant** : revient une fois à sa mort (ou révèle son tueur). |
| **Lolo / Angatra** | Âmes des morts. | **Fantômes** : les éliminés deviennent « lolo » (vote secret, ou pur habillage). |
| **Lalomena** | Bête rouge rare et puissante. | **Colosse** : survit à la 1re attaque qui le vise. |
| Mpihaza ✓ | Chasseur. | À sa mort, emporte un joueur. |

---

## 5. Questions ouvertes à trancher (pour le LLM spécialisé)

1. **Nom & pouvoir du remplaçant de Cupidon** : Zazavavindrano avec quel pouvoir
   (4.a) ? Ou garder un « lieur d'amoureux » sous un autre nom (Ranoro ?) ?
2. **Garde-t-on la mécanique « amoureux »** dans le jeu, et sur quelle créature ?
3. **Grille finale recommandée** : quels rôles pour un MVP équilibré (proposer une
   liste « cœur » obligatoire + une liste « optionnels »), avec **un pouvoir précis,
   résoluble côté serveur** pour chacun (cf. contraintes §1).
4. **Renommer Mponina / Mpihaza** en figures plus folkloriques, ou garder pour la lisibilité ?
5. **Cohérence linguistique** : vérifier l'orthographe/sens malgache de chaque nom et
   sa **prononciation** ; éviter les faux-amis ou connotations gênantes.
6. **Cohérence mythologique** : éviter de dénaturer une figure sacrée/respectée
   (ex. razana, ombiasy) d'une façon qui choquerait un public malgache.
7. **Lore court par rôle** (2–3 phrases) à afficher sur la carte de rôle.

### Format de réponse souhaité
Pour chaque rôle retenu, fournir :
```
- id            : <slug technique, ex. "kalanoro">
- nameMg        : <nom affiché, malgache>
- team          : "village" | "songomby" | "neutre"
- optional      : true | false  (activable dans le lobby ?)
- desc          : <1 phrase, carte de rôle>
- lore          : <2–3 phrases d'ambiance, optionnel>
- power         : <mécanique précise : quand ? cible ? effet ? limites ?>
- folklore_ref  : <source / créature d'origine>
```
Plus : une **grille finale recommandée** (cœur + optionnels) et un mot sur l'**équilibrage**.

---

## Sources
- Zazavavindrano (sirènes malgaches) — https://voyage-madagascar.org/zazavavindrano-sirenes-malgaches/
- « Filles des eaux » — https://www.vol-direct.net/tout-savoir-sur-les-zazavavindrano-ou-les-filles-des-eaux.html
- Légende betsimisaraka des Zazavavindrano — https://lemurie.over-blog.com/2015/07/la-legende-betsimisaraka-des-zazavavindrano.html
- Ranoro, fille de l'eau — https://www.madamagazine.com/en/ranoro-die-tochter-des-wassers/
- Kalanoro — https://en.wikipedia.org/wiki/Kalanoro
- Le jeune guérisseur et la sainte kalanoro — https://journals.openedition.org/jda/5886?lang=en
- Malagasy mythology — https://en.wikipedia.org/wiki/Malagasy_mythology
- Légendes de Madagascar : les monstres — https://randriamialy.mondoblog.org/2014/07/05/legendes-de-madagascar-les-monstres/
- Contes et légendes : les personnages — https://randriamialy.mondoblog.org/2014/07/08/contes-legendes-de-madagascar-les-personnages/
- Mythologie malgache (France Minéraux) — https://www.france-mineraux.fr/mythologies/mythologie-malgache/
- Ibonia — https://en.wikipedia.org/wiki/Ibonia
