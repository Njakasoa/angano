# Angano — inventaire audio

> Généré par `bun run doc:audio`. Ne pas éditer à la main.

**157 fichiers attendus** · 0 à générer · 22.6 Mo · 24.4 min

## Régénérer un son

Le générateur **saute tout fichier déjà présent**. Supprimer un fichier est donc la
façon de le redemander, et rien de ce que tu gardes n'est réenregistré ni refacturé.

```bash
set -a; . ../core-api/.env; set +a          # la clé ElevenLabs vit là, et nulle part ailleurs
bun scripts/generate-audio.ts <commande>    # la commande de la ligne, colonne de droite
```

Tout est commité : `git status --short public/assets/audio` liste ce qui a été
supprimé, `git checkout -- <fichier>` annule une suppression regrettée.

Une ligne **dirigée** porte sa propre version balisée pour eleven_v3 ; les autres
reçoivent une balise unique déduite de leur rôle. Voir `docs/direction-sonore.md`.

## Les conteurs

| Légende | Voix | Lignes |
|---|---|--:|
| `lanternes-mangrove` | `LOF1yccpEMqzvhfbLTGh` | 41 |
| `barriere-rompue` | `EMuO6fFLrXKOryHzij6K` | 41 |
| `lac-jarres-blanches` | `0dPqNXnhg2bmxQv1WKDp` | 37 |

## Tous les fichiers

| fichier | Ko | s | famille | clé / label | dirigé | commande |
|---|--:|--:|---|---|:-:|---|
| `sfx_tap.mp3` | 14 | 0.8 | bruitage | tap | — | `--sfx` |
| `sfx_role_reveal.mp3` | 36 | 2.2 | bruitage | role_reveal | — | `--sfx` |
| `sfx_night_fall.mp3` | 56 | 3.5 | bruitage | night_fall | — | `--sfx` |
| `sfx_death.mp3` | 44 | 2.8 | bruitage | death | — | `--sfx` |
| `sfx_vote_cast.mp3` | 17 | 1.0 | bruitage | vote_cast | — | `--sfx` |
| `sfx_vote_result.mp3` | 40 | 2.5 | bruitage | vote_result | — | `--sfx` |
| `sfx_discovery.mp3` | 32 | 2.0 | bruitage | discovery | — | `--sfx` |
| `sfx_blocked.mp3` | 29 | 1.8 | bruitage | blocked | — | `--sfx` |
| `sfx_mission_request.mp3` | 20 | 1.2 | bruitage | mission_request | — | `--sfx` |
| `sfx_mission_validated.mp3` | 32 | 2.0 | bruitage | mission_validated | — | `--sfx` |
| `sfx_your_turn.mp3` | 24 | 1.5 | bruitage | your_turn | — | `--sfx` |
| `sfx_timer_last.mp3` | 20 | 1.2 | bruitage | timer_last | — | `--sfx` |
| `sfx_victory_village.mp3` | 56 | 3.5 | bruitage | victory_village | — | `--sfx` |
| `sfx_victory_songomby.mp3` | 56 | 3.5 | bruitage | victory_songomby | — | `--sfx` |
| `vo_role_mponina.mp3` | 97 | 6.1 | voix statique | Tu es Mponina. Un villageois sans pouvoir. T… | — | `--voice` |
| `vo_role_songomby.mp3` | 72 | 4.6 | voix statique | Tu es Songomby. La bête qui dévore. Chaque n… | — | `--voice` |
| `vo_role_mpisikidy.mp3` | 100 | 6.3 | voix statique | Tu es Mpisikidy. Les graines du sikidy te pa… | — | `--voice` |
| `vo_role_ombiasy.mp3` | 95 | 6.0 | voix statique | Tu es Ombiasy. Un remède, un rituel d'exil. … | — | `--voice` |
| `vo_role_fanany.mp3` | 105 | 6.7 | voix statique | Tu es Fanany, serpent des ancêtres. Marque u… | — | `--voice` |
| `vo_role_zazavavindrano.mp3` | 83 | 5.2 | voix statique | Tu es Zazavavindrano, esprit des eaux. Pose … | — | `--voice` |
| `vo_role_kalanoro.mp3` | 105 | 6.6 | voix statique | Tu es Kalanoro. Tes pieds sont inversés, tes… | — | `--voice` |
| `vo_role_kinoly.mp3` | 76 | 4.8 | voix statique | Tu es Kinoly, un revenant qui s'ignore encor… | — | `--voice` |
| `vo_role_mpamosavy.mp3` | 86 | 5.4 | voix statique | Tu es Mpamosavy, sorcier de l'ombre. Maudis … | — | `--voice` |
| `vo_victory_village.mp3` | 48 | 3.0 | voix statique | Le village a chassé tous les monstres. L'aub… | — | `--voice` |
| `vo_victory_songomby.mp3` | 85 | 5.3 | voix statique | Les Songomby ont fait taire le village. Plus… | — | `--voice` |
| `salon.mp3` | 424 | 27.0 | ambiance | salon | — | `--ambiance` |
| `legende.mp3` | 424 | 27.0 | ambiance | legende | — | `--ambiance` |
| `nuit_zazavavindrano.mp3` | 424 | 27.0 | ambiance | nuit_zazavavindrano | — | `--ambiance` |
| `nuit_mpamosavy.mp3` | 424 | 27.0 | ambiance | nuit_mpamosavy | — | `--ambiance` |
| `nuit_mpisikidy.mp3` | 424 | 27.0 | ambiance | nuit_mpisikidy | — | `--ambiance` |
| `nuit_kalanoro.mp3` | 424 | 27.0 | ambiance | nuit_kalanoro | — | `--ambiance` |
| `nuit_kinoly.mp3` | 424 | 27.0 | ambiance | nuit_kinoly | — | `--ambiance` |
| `nuit_songomby.mp3` | 424 | 27.0 | ambiance | nuit_songomby | — | `--ambiance` |
| `nuit_ombiasy.mp3` | 424 | 27.0 | ambiance | nuit_ombiasy | — | `--ambiance` |
| `aube.mp3` | 424 | 27.0 | ambiance | aube | — | `--ambiance` |
| `debat.mp3` | 424 | 27.0 | ambiance | debat | — | `--ambiance` |
| `vote.mp3` | 424 | 27.0 | ambiance | vote | — | `--ambiance` |
| `revelation.mp3` | 424 | 27.0 | ambiance | revelation | — | `--ambiance` |
| `vo_lm_prose_01.mp3` | 246 | 15.7 | pack · lanternes-mangrove | intro | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_02.mp3` | 96 | 6.1 | pack · lanternes-mangrove | ambiance_night | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_03.mp3` | 82 | 5.2 | pack · lanternes-mangrove | ambiance_dawn | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_04.mp3` | 81 | 5.1 | pack · lanternes-mangrove | ambiance_debate | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_05.mp3` | 105 | 6.6 | pack · lanternes-mangrove | ambiance_vote | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_06.mp3` | 92 | 5.8 | pack · lanternes-mangrove | nuit_zazavavindrano | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_07.mp3` | 110 | 7.0 | pack · lanternes-mangrove | nuit_mpamosavy | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_08.mp3` | 95 | 6.0 | pack · lanternes-mangrove | nuit_mpisikidy | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_09.mp3` | 102 | 6.5 | pack · lanternes-mangrove | nuit_kalanoro | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_10.mp3` | 100 | 6.3 | pack · lanternes-mangrove | nuit_kinoly | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_11.mp3` | 89 | 5.6 | pack · lanternes-mangrove | nuit_songomby | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_12.mp3` | 109 | 6.9 | pack · lanternes-mangrove | nuit_ombiasy | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_13.mp3` | 92 | 5.8 | pack · lanternes-mangrove | jour_night_0 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_14.mp3` | 85 | 5.4 | pack · lanternes-mangrove | jour_night_1 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_15.mp3` | 96 | 6.1 | pack · lanternes-mangrove | jour_night_2 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_16.mp3` | 81 | 5.1 | pack · lanternes-mangrove | jour_dawn_0 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_17.mp3` | 76 | 4.8 | pack · lanternes-mangrove | jour_dawn_1 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_18.mp3` | 97 | 6.2 | pack · lanternes-mangrove | jour_dawn_2 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_19.mp3` | 62 | 3.9 | pack · lanternes-mangrove | jour_debate_0 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_20.mp3` | 77 | 4.9 | pack · lanternes-mangrove | jour_debate_1 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_21.mp3` | 84 | 5.3 | pack · lanternes-mangrove | jour_debate_2 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_22.mp3` | 91 | 5.8 | pack · lanternes-mangrove | jour_vote_0 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_23.mp3` | 80 | 5.0 | pack · lanternes-mangrove | jour_vote_1 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_24.mp3` | 97 | 6.2 | pack · lanternes-mangrove | jour_vote_2 | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_25.mp3` | 166 | 10.6 | pack · lanternes-mangrove | victoire_village | non | `--pack=lanternes-mangrove` |
| `vo_lm_prose_26.mp3` | 156 | 9.9 | pack · lanternes-mangrove | victoire_songomby | non | `--pack=lanternes-mangrove` |
| `vo_lm_aube_personne.mp3` | 118 | 7.5 | pack · lanternes-mangrove | aube_personne | non | `--pack=lanternes-mangrove` |
| `vo_lm_aube_une_mort.mp3` | 145 | 9.2 | pack · lanternes-mangrove | aube_une_mort | non | `--pack=lanternes-mangrove` |
| `vo_lm_aube_plusieurs_morts.mp3` | 140 | 8.9 | pack · lanternes-mangrove | aube_plusieurs_morts | non | `--pack=lanternes-mangrove` |
| `vo_lm_reveal_mponina.mp3` | 135 | 8.6 | pack · lanternes-mangrove | reveal_mponina | non | `--pack=lanternes-mangrove` |
| `vo_lm_reveal_songomby.mp3` | 120 | 7.6 | pack · lanternes-mangrove | reveal_songomby | non | `--pack=lanternes-mangrove` |
| `vo_lm_reveal_mpisikidy.mp3` | 106 | 6.7 | pack · lanternes-mangrove | reveal_mpisikidy | non | `--pack=lanternes-mangrove` |
| `vo_lm_reveal_ombiasy.mp3` | 120 | 7.6 | pack · lanternes-mangrove | reveal_ombiasy | non | `--pack=lanternes-mangrove` |
| `vo_lm_reveal_fanany.mp3` | 115 | 7.3 | pack · lanternes-mangrove | reveal_fanany | non | `--pack=lanternes-mangrove` |
| `vo_lm_reveal_zazavavindrano.mp3` | 122 | 7.8 | pack · lanternes-mangrove | reveal_zazavavindrano | non | `--pack=lanternes-mangrove` |
| `vo_lm_reveal_kalanoro.mp3` | 118 | 7.5 | pack · lanternes-mangrove | reveal_kalanoro | non | `--pack=lanternes-mangrove` |
| `vo_lm_reveal_kinoly.mp3` | 126 | 8.0 | pack · lanternes-mangrove | reveal_kinoly | non | `--pack=lanternes-mangrove` |
| `vo_lm_reveal_mpamosavy.mp3` | 135 | 8.6 | pack · lanternes-mangrove | reveal_mpamosavy | non | `--pack=lanternes-mangrove` |
| `vo_lm_vote_sentence.mp3` | 105 | 6.6 | pack · lanternes-mangrove | vote_sentence | non | `--pack=lanternes-mangrove` |
| `vo_lm_vote_personne.mp3` | 117 | 7.4 | pack · lanternes-mangrove | vote_personne | non | `--pack=lanternes-mangrove` |
| `vo_lm_razana_vengeance.mp3` | 149 | 9.4 | pack · lanternes-mangrove | razana_vengeance | non | `--pack=lanternes-mangrove` |
| `vo_br_prose_01.mp3` | 395 | 25.2 | pack · barriere-rompue | intro | non | `--pack=barriere-rompue` |
| `vo_br_prose_02.mp3` | 154 | 9.8 | pack · barriere-rompue | ambiance_night | non | `--pack=barriere-rompue` |
| `vo_br_prose_03.mp3` | 126 | 8.0 | pack · barriere-rompue | ambiance_dawn | non | `--pack=barriere-rompue` |
| `vo_br_prose_04.mp3` | 116 | 7.4 | pack · barriere-rompue | ambiance_debate | non | `--pack=barriere-rompue` |
| `vo_br_prose_05.mp3` | 124 | 7.8 | pack · barriere-rompue | ambiance_vote | non | `--pack=barriere-rompue` |
| `vo_br_prose_06.mp3` | 104 | 6.6 | pack · barriere-rompue | nuit_zazavavindrano | non | `--pack=barriere-rompue` |
| `vo_br_prose_07.mp3` | 110 | 7.0 | pack · barriere-rompue | nuit_mpamosavy | non | `--pack=barriere-rompue` |
| `vo_br_prose_08.mp3` | 138 | 8.8 | pack · barriere-rompue | nuit_mpisikidy | non | `--pack=barriere-rompue` |
| `vo_br_prose_09.mp3` | 111 | 7.0 | pack · barriere-rompue | nuit_kalanoro | non | `--pack=barriere-rompue` |
| `vo_br_prose_10.mp3` | 131 | 8.3 | pack · barriere-rompue | nuit_kinoly | non | `--pack=barriere-rompue` |
| `vo_br_prose_11.mp3` | 132 | 8.4 | pack · barriere-rompue | nuit_songomby | non | `--pack=barriere-rompue` |
| `vo_br_prose_12.mp3` | 129 | 8.2 | pack · barriere-rompue | nuit_ombiasy | non | `--pack=barriere-rompue` |
| `vo_br_prose_13.mp3` | 146 | 9.3 | pack · barriere-rompue | jour_night_0 | non | `--pack=barriere-rompue` |
| `vo_br_prose_14.mp3` | 100 | 6.3 | pack · barriere-rompue | jour_night_1 | non | `--pack=barriere-rompue` |
| `vo_br_prose_15.mp3` | 100 | 6.3 | pack · barriere-rompue | jour_night_2 | non | `--pack=barriere-rompue` |
| `vo_br_prose_16.mp3` | 129 | 8.2 | pack · barriere-rompue | jour_dawn_0 | non | `--pack=barriere-rompue` |
| `vo_br_prose_17.mp3` | 136 | 8.6 | pack · barriere-rompue | jour_dawn_1 | non | `--pack=barriere-rompue` |
| `vo_br_prose_18.mp3` | 130 | 8.2 | pack · barriere-rompue | jour_dawn_2 | non | `--pack=barriere-rompue` |
| `vo_br_prose_19.mp3` | 97 | 6.2 | pack · barriere-rompue | jour_debate_0 | non | `--pack=barriere-rompue` |
| `vo_br_prose_20.mp3` | 102 | 6.5 | pack · barriere-rompue | jour_debate_1 | non | `--pack=barriere-rompue` |
| `vo_br_prose_21.mp3` | 106 | 6.7 | pack · barriere-rompue | jour_debate_2 | non | `--pack=barriere-rompue` |
| `vo_br_prose_22.mp3` | 112 | 7.1 | pack · barriere-rompue | jour_vote_0 | non | `--pack=barriere-rompue` |
| `vo_br_prose_23.mp3` | 90 | 5.7 | pack · barriere-rompue | jour_vote_1 | non | `--pack=barriere-rompue` |
| `vo_br_prose_24.mp3` | 114 | 7.2 | pack · barriere-rompue | jour_vote_2 | non | `--pack=barriere-rompue` |
| `vo_br_prose_25.mp3` | 166 | 10.6 | pack · barriere-rompue | victoire_village | non | `--pack=barriere-rompue` |
| `vo_br_prose_26.mp3` | 147 | 9.4 | pack · barriere-rompue | victoire_songomby | non | `--pack=barriere-rompue` |
| `vo_br_aube_personne.mp3` | 158 | 10.1 | pack · barriere-rompue | aube_personne | non | `--pack=barriere-rompue` |
| `vo_br_aube_une_mort.mp3` | 154 | 9.8 | pack · barriere-rompue | aube_une_mort | non | `--pack=barriere-rompue` |
| `vo_br_aube_plusieurs_morts.mp3` | 152 | 9.7 | pack · barriere-rompue | aube_plusieurs_morts | non | `--pack=barriere-rompue` |
| `vo_br_reveal_mponina.mp3` | 156 | 9.9 | pack · barriere-rompue | reveal_mponina | non | `--pack=barriere-rompue` |
| `vo_br_reveal_songomby.mp3` | 135 | 8.6 | pack · barriere-rompue | reveal_songomby | non | `--pack=barriere-rompue` |
| `vo_br_reveal_mpisikidy.mp3` | 156 | 9.9 | pack · barriere-rompue | reveal_mpisikidy | non | `--pack=barriere-rompue` |
| `vo_br_reveal_ombiasy.mp3` | 132 | 8.4 | pack · barriere-rompue | reveal_ombiasy | non | `--pack=barriere-rompue` |
| `vo_br_reveal_fanany.mp3` | 131 | 8.3 | pack · barriere-rompue | reveal_fanany | non | `--pack=barriere-rompue` |
| `vo_br_reveal_zazavavindrano.mp3` | 134 | 8.5 | pack · barriere-rompue | reveal_zazavavindrano | non | `--pack=barriere-rompue` |
| `vo_br_reveal_kalanoro.mp3` | 124 | 7.8 | pack · barriere-rompue | reveal_kalanoro | non | `--pack=barriere-rompue` |
| `vo_br_reveal_kinoly.mp3` | 155 | 9.8 | pack · barriere-rompue | reveal_kinoly | non | `--pack=barriere-rompue` |
| `vo_br_reveal_mpamosavy.mp3` | 131 | 8.3 | pack · barriere-rompue | reveal_mpamosavy | non | `--pack=barriere-rompue` |
| `vo_br_vote_sentence.mp3` | 147 | 9.4 | pack · barriere-rompue | vote_sentence | non | `--pack=barriere-rompue` |
| `vo_br_vote_personne.mp3` | 130 | 8.2 | pack · barriere-rompue | vote_personne | non | `--pack=barriere-rompue` |
| `vo_br_razana_vengeance.mp3` | 164 | 10.4 | pack · barriere-rompue | razana_vengeance | non | `--pack=barriere-rompue` |
| `vo_lj_prose_01.mp3` | 435 | 27.8 | pack · lac-jarres-blanches | intro | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_02.mp3` | 140 | 8.9 | pack · lac-jarres-blanches | ambiance_night | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_03.mp3` | 132 | 8.4 | pack · lac-jarres-blanches | ambiance_dawn | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_04.mp3` | 86 | 5.4 | pack · lac-jarres-blanches | ambiance_debate | non | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_05.mp3` | 140 | 8.9 | pack · lac-jarres-blanches | ambiance_vote | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_06.mp3` | 177 | 11.3 | pack · lac-jarres-blanches | nuit_zazavavindrano | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_07.mp3` | 174 | 11.0 | pack · lac-jarres-blanches | nuit_mpamosavy | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_08.mp3` | 158 | 10.1 | pack · lac-jarres-blanches | nuit_mpisikidy | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_09.mp3` | 152 | 9.7 | pack · lac-jarres-blanches | nuit_kalanoro | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_10.mp3` | 187 | 11.9 | pack · lac-jarres-blanches | nuit_kinoly | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_11.mp3` | 146 | 9.3 | pack · lac-jarres-blanches | nuit_songomby | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_12.mp3` | 157 | 10.0 | pack · lac-jarres-blanches | nuit_ombiasy | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_13.mp3` | 141 | 9.0 | pack · lac-jarres-blanches | jour_night_0 | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_14.mp3` | 115 | 7.3 | pack · lac-jarres-blanches | jour_night_1 | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_15.mp3` | 120 | 7.6 | pack · lac-jarres-blanches | jour_dawn_0 | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_16.mp3` | 124 | 7.8 | pack · lac-jarres-blanches | jour_dawn_1 | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_17.mp3` | 114 | 7.2 | pack · lac-jarres-blanches | jour_debate_0 | non | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_18.mp3` | 104 | 6.6 | pack · lac-jarres-blanches | jour_debate_1 | non | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_19.mp3` | 131 | 8.3 | pack · lac-jarres-blanches | jour_vote_0 | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_20.mp3` | 135 | 8.6 | pack · lac-jarres-blanches | jour_vote_1 | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_21.mp3` | 169 | 10.7 | pack · lac-jarres-blanches | victoire_village | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_22.mp3` | 177 | 11.3 | pack · lac-jarres-blanches | victoire_songomby | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_aube_personne.mp3` | 224 | 14.2 | pack · lac-jarres-blanches | aube_personne | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_aube_une_mort.mp3` | 166 | 10.6 | pack · lac-jarres-blanches | aube_une_mort | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_aube_plusieurs_morts.mp3` | 190 | 12.1 | pack · lac-jarres-blanches | aube_plusieurs_morts | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_mponina.mp3` | 198 | 12.6 | pack · lac-jarres-blanches | reveal_mponina | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_songomby.mp3` | 162 | 10.3 | pack · lac-jarres-blanches | reveal_songomby | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_mpisikidy.mp3` | 194 | 12.3 | pack · lac-jarres-blanches | reveal_mpisikidy | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_ombiasy.mp3` | 175 | 11.1 | pack · lac-jarres-blanches | reveal_ombiasy | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_fanany.mp3` | 145 | 9.2 | pack · lac-jarres-blanches | reveal_fanany | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_zazavavindrano.mp3` | 187 | 11.9 | pack · lac-jarres-blanches | reveal_zazavavindrano | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_kalanoro.mp3` | 149 | 9.4 | pack · lac-jarres-blanches | reveal_kalanoro | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_kinoly.mp3` | 180 | 11.4 | pack · lac-jarres-blanches | reveal_kinoly | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_mpamosavy.mp3` | 158 | 10.1 | pack · lac-jarres-blanches | reveal_mpamosavy | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_vote_sentence.mp3` | 138 | 8.8 | pack · lac-jarres-blanches | vote_sentence | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_vote_personne.mp3` | 156 | 9.9 | pack · lac-jarres-blanches | vote_personne | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_razana_vengeance.mp3` | 200 | 12.7 | pack · lac-jarres-blanches | razana_vengeance | oui | `--pack=lac-jarres-blanches` |

Aucun orphelin : tout ce qui est sur le disque est référencé.
