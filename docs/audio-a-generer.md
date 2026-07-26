# Angano — inventaire audio

> Généré par `bun run doc:audio`. Ne pas éditer à la main.

**75 fichiers attendus** · 28 à générer · 9.5 Mo · 10.3 min

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
| `lac-jarres-blanches` | `0dPqNXnhg2bmxQv1WKDp` | 37 |

## Tous les fichiers

| fichier | Ko | s | famille | clé / label | dirigé | commande |
|---|--:|--:|---|---|:-:|---|
| `sfx_tap.mp3` | **à générer** | — | bruitage | tap | — | `--sfx` |
| `sfx_role_reveal.mp3` | 36 | 2.2 | bruitage | role_reveal | — | `--sfx` |
| `sfx_night_fall.mp3` | 56 | 3.5 | bruitage | night_fall | — | `--sfx` |
| `sfx_death.mp3` | 44 | 2.8 | bruitage | death | — | `--sfx` |
| `sfx_vote_cast.mp3` | 17 | 1.0 | bruitage | vote_cast | — | `--sfx` |
| `sfx_vote_result.mp3` | **à générer** | — | bruitage | vote_result | — | `--sfx` |
| `sfx_discovery.mp3` | 32 | 2.0 | bruitage | discovery | — | `--sfx` |
| `sfx_blocked.mp3` | **à générer** | — | bruitage | blocked | — | `--sfx` |
| `sfx_mission_request.mp3` | 20 | 1.2 | bruitage | mission_request | — | `--sfx` |
| `sfx_mission_validated.mp3` | 32 | 2.0 | bruitage | mission_validated | — | `--sfx` |
| `sfx_your_turn.mp3` | 24 | 1.5 | bruitage | your_turn | — | `--sfx` |
| `sfx_timer_last.mp3` | **à générer** | — | bruitage | timer_last | — | `--sfx` |
| `sfx_victory_village.mp3` | **à générer** | — | bruitage | victory_village | — | `--sfx` |
| `sfx_victory_songomby.mp3` | **à générer** | — | bruitage | victory_songomby | — | `--sfx` |
| `vo_role_mponina.mp3` | **à générer** | — | voix statique | Tu es Mponina. Un villageois sans pouvoir. T… | — | `--voice` |
| `vo_role_songomby.mp3` | **à générer** | — | voix statique | Tu es Songomby. La bête qui dévore. Chaque n… | — | `--voice` |
| `vo_role_mpisikidy.mp3` | **à générer** | — | voix statique | Tu es Mpisikidy. Les graines du sikidy te pa… | — | `--voice` |
| `vo_role_ombiasy.mp3` | **à générer** | — | voix statique | Tu es Ombiasy. Un remède, un rituel d'exil. … | — | `--voice` |
| `vo_role_fanany.mp3` | **à générer** | — | voix statique | Tu es Fanany, serpent des ancêtres. Marque u… | — | `--voice` |
| `vo_role_zazavavindrano.mp3` | **à générer** | — | voix statique | Tu es Zazavavindrano, esprit des eaux. Pose … | — | `--voice` |
| `vo_role_kalanoro.mp3` | **à générer** | — | voix statique | Tu es Kalanoro. Tes pieds sont inversés, tes… | — | `--voice` |
| `vo_role_kinoly.mp3` | **à générer** | — | voix statique | Tu es Kinoly, un revenant qui s'ignore encor… | — | `--voice` |
| `vo_role_mpamosavy.mp3` | **à générer** | — | voix statique | Tu es Mpamosavy, sorcier de l'ombre. Maudis … | — | `--voice` |
| `vo_victory_village.mp3` | **à générer** | — | voix statique | Le village a chassé tous les monstres. L'aub… | — | `--voice` |
| `vo_victory_songomby.mp3` | **à générer** | — | voix statique | Les Songomby ont fait taire le village. Plus… | — | `--voice` |
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
| `vo_lj_prose_01.mp3` | **à générer** | — | pack · lac-jarres-blanches | intro | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_02.mp3` | 140 | 8.9 | pack · lac-jarres-blanches | ambiance_night | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_03.mp3` | 132 | 8.4 | pack · lac-jarres-blanches | ambiance_dawn | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_04.mp3` | 86 | 5.4 | pack · lac-jarres-blanches | ambiance_debate | non | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_05.mp3` | 140 | 8.9 | pack · lac-jarres-blanches | ambiance_vote | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_06.mp3` | **à générer** | — | pack · lac-jarres-blanches | nuit_zazavavindrano | oui | `--pack=lac-jarres-blanches` |
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
| `vo_lj_prose_21.mp3` | **à générer** | — | pack · lac-jarres-blanches | victoire_village | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_prose_22.mp3` | 177 | 11.3 | pack · lac-jarres-blanches | victoire_songomby | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_aube_personne.mp3` | 224 | 14.2 | pack · lac-jarres-blanches | aube_personne | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_aube_une_mort.mp3` | 166 | 10.6 | pack · lac-jarres-blanches | aube_une_mort | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_aube_plusieurs_morts.mp3` | 190 | 12.1 | pack · lac-jarres-blanches | aube_plusieurs_morts | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_mponina.mp3` | 198 | 12.6 | pack · lac-jarres-blanches | reveal_mponina | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_songomby.mp3` | 162 | 10.3 | pack · lac-jarres-blanches | reveal_songomby | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_mpisikidy.mp3` | 194 | 12.3 | pack · lac-jarres-blanches | reveal_mpisikidy | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_ombiasy.mp3` | **à générer** | — | pack · lac-jarres-blanches | reveal_ombiasy | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_fanany.mp3` | 145 | 9.2 | pack · lac-jarres-blanches | reveal_fanany | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_zazavavindrano.mp3` | **à générer** | — | pack · lac-jarres-blanches | reveal_zazavavindrano | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_kalanoro.mp3` | **à générer** | — | pack · lac-jarres-blanches | reveal_kalanoro | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_kinoly.mp3` | **à générer** | — | pack · lac-jarres-blanches | reveal_kinoly | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_reveal_mpamosavy.mp3` | **à générer** | — | pack · lac-jarres-blanches | reveal_mpamosavy | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_vote_sentence.mp3` | **à générer** | — | pack · lac-jarres-blanches | vote_sentence | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_vote_personne.mp3` | **à générer** | — | pack · lac-jarres-blanches | vote_personne | oui | `--pack=lac-jarres-blanches` |
| `vo_lj_razana_vengeance.mp3` | **à générer** | — | pack · lac-jarres-blanches | razana_vengeance | oui | `--pack=lac-jarres-blanches` |

Aucun orphelin : tout ce qui est sur le disque est référencé.
