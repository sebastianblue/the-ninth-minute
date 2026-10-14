# The Ninth Minute

[Play The Ninth Minute](https://sebastianblue.github.io/the-ninth-minute/)

A complete, self-contained archival mystery inside the fictional Morrow Municipal Archive. Nine connected records, three parallel investigation threads, an optional hidden record, and three final dispositions.

Begin with the public register. All necessary evidence lives on the site. No real-world contact, outside research, source-code inspection, account creation, or time gates are required. Sound is optional and duplicates a visible pulse trace.

Progress, field notes, puzzle interactions, and chosen disposition are stored locally. Sessions can be exported and imported between browsers as files or recovery codes. Each record offers three optional hints; the third explains the full solution.

## Run locally

Use Node.js for the verification suite, and Python 3 for the preview:

```
npm test
npm run dev
```

Open http://127.0.0.1:8765. The published game is the `dist/` directory; all asset and module paths are relative so it works beneath a GitHub Pages project path. GitHub Pages publishes a matching copy on the `gh-pages` branch. There is no application backend.

## Design research

The puzzle trail was designed backward from its final meta-puzzle. Every mechanic supplies its required information, has a recognisable output, and advances the story. Constraints are explicit where ambiguity would create guesswork; discovery is carried by evidence and cross-document connections. Independent threads let solvers move around a bottleneck. Optional progressive hints support completion without mandatory hints or lockouts.

Sources consulted:

- [Clara Fernández-Vara, Puzzle Writing: Best Practices, GDC](https://www.gdcvault.com/play/1013851/puzzle-writing-best) — puzzles as a contract supplying the information necessary to solve, integrated with narrative.
- [Puzzled Pint, Introduction to Puzzled Pint Authoring](https://puzzledpint.org/volunteering/write-puzzles/) — meaningful aha moments, recognisable answers, flavor-text clues, writing the meta first, and test-solving. This game targets a more demanding experience than Puzzled Pint's beginner sets.
- [MIT Mystery Hunt, Resources for Beginners](https://web.mit.edu/activities/puzzle/resources.html) — puzzle-hunt structures, tools, and meta-puzzle resources.
- [Acolyte creator's design account, Game Developer](https://www.gamedeveloper.com/design/deep-dive-designing-for-spontaneity-and-non-linearity-in-alternate-reality-games-with-i-acolyte-i-) — nonlinearity and discoveries driven by the player's own investigation.

The site is an original work, not an adaptation of those games. Automated checks establish mechanical consistency and uniqueness for the constrained puzzles. They do not establish a measured human solving time; a blind human playtest remains valuable for difficulty calibration.

## Access and presentation

Keyboard controls, labels in addition to color, text equivalents for audio and the turning mask, reduced-motion support, and responsive layouts. Optional Google Fonts enhance the typography; local font fallbacks keep the game usable if they cannot load. No analytics or tracking code.
