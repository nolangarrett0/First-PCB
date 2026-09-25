# Git checkpoint

Use when the owner requests a checkpoint, commit, or push. A checkpoint means verify the intended work, commit it, and push it to the configured GitHub remote.

Run relevant checks: `npm run lint` and `npm run build` for web changes. If native packaging is added, run its check or release build as appropriate before checkpointing native changes.

Review the files to stage and exclude unrelated work. Before pushing, inspect the branch, remote, and outgoing commits. A request for only a commit or only a push authorizes only that action.
