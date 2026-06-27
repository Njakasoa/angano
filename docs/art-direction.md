# Angano — Direction artistique (bible de style)

Référence pour générer **toutes** les illustrations du jeu via **GPT Image 2**. Le but :
une identité visuelle unique, cohérente, ancrée dans le folklore malgache. Les prompts
complets (auto-suffisants) sont dans `illustrations-prompts.csv` — ce document explique
le *pourquoi* et fixe les invariants pour rester cohérent d'une image à l'autre.

## Style retenu — « Conte peint sombre »
Peinture numérique texturée (huile), coups de pinceau visibles, grain de toile.
**Clair-obscur** avec **un seul foyer de lumière** par image (lune froide ou lampe à
huile chaude). Ambiance cinématographique, premium, façon *Dixit / Mysterium* mais plus
sombre. Les personnages se lisent comme **malgaches**.

## Palette
| Rôle | Couleur | Hex |
|---|---|---|
| Terre / chaleur | Latérite | `#8c3b2b` |
| Nuit / fond | Indigo profond | `#1b2350` |
| Matière / peau / raffia | Ocre raffia | `#c9a04e` |
| Accent / lueur | Or | `#e8c15a` |
Accent maléfique ponctuel : lueur **vert maladif** (sorts, poison). Yeux : **ambre**
(Songomby) ou **rouge** (Kalanoro, Kinoly).

## Ancrage malgache (à parsemer, pas à surcharger)
Lamba (tissu drapé), baobabs, rizières en terrasses, villages des hautes terres en terre
rouge, zébu, raffia, forêt humide de l'Est, tombeaux. **Pas** de symboles d'autres
folklores (ni loup-garou européen, ni vaudou, ni asiatique).

## Cadrage & formats
- **Portraits de rôle** : carré **1024×1024**, sujet centré buste/3-4 (lisible dans la
  vignette ronde de la carte ET recadrable en bannière).
- **Pouvoirs & scènes** : paysage **1536×1024**, sujet focal centré, profondeur d'ambiance.
- **Icône** : carré **1024×1024**, emblème simple. **OG** : paysage **1536×1024**, garder
  un ciel/espace calme pour un overlay texte ultérieur.
- Sortie **PNG**. (Intégration ~512 px ensuite : marge nette.)

## Garde-fous (dans chaque prompt)
`No text, no letters, no numbers, no watermark, no signature, no UI, no border.`

## Fiches canoniques (traits à RE-décrire à chaque réutilisation)
GPT Image 2 n'a pas de verrou de personnage : on répète les traits clés pour la cohérence.
- **Songomby** — grande bête nocturne mi-cheval mi-zébu, **oreilles d'âne**, yeux **ambre**
  luisants, crocs, pelage sombre emmêlé ; tapie dans les roseaux d'une rizière.
- **Mpisikidy** — devin âgé, lamba sur l'épaule, jette les graines du **sikidy** en grille
  sur une natte, fine fumée, lueur d'augure, regard serein.
- **Ombiasy** — guérisseur couvert d'**ody** (amulettes) et perles, fioles, plantes
  médicinales, braises chaudes, mains usées.
- **Mpihaza** — chasseur maigre, **sagaie** (et arc dans le dos), habits de raffia/écorce,
  à l'affût en lisière de forêt.
- **Zazavavindrano** — femme-esprit des eaux, belle et inquiétante, longs cheveux
  ruisselants, peau luisante, à demi immergée dans une rivière sous la lune, roseaux/nénuphars.
- **Kalanoro** — petit être poilu de la forêt, longs cheveux/ongles, yeux **rouges**,
  **pieds inversés**, accroupi près d'un ruisseau humide.
- **Kinoly** — revenant d'apparence villageoise ordinaire mais yeux **rouges** faibles et
  ongles anormalement longs, peau pâle, dissimulé parmi les villageois.
- **Mpamosavy** — sorcier maléfique décharné, gestes de malédiction sur des tombeaux,
  lueur **verte** maladive, cendres et os.
- **Mponina** — villageois ordinaire en lamba, lampe à huile, regard inquiet, ruelle nocturne.

## Structure d'un prompt
`STYLE (bible) + SUBJECT (sujet précis) + FRAMING (format/cadrage) + GUARD (garde-fous)`
→ chaque cellule `prompt` du CSV est complète : copier-coller dans GPT Image 2, rien à ajouter.
