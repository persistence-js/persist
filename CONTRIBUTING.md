# Contributing to ih

## General Workflow

1. Fork the repo
1. Cut namespaced feature branch with initials from master
    - FL_bug/...
    - FL_feat/...
    - FL_test/...
    - FL_doc/...
    - FL_refactor/...
1. Make commits to your feature branch (only make changes that are relevant to this branch)
    - commit messages should start with a capital letter
    - commit messages should be in the present tense
    - commit messages should not end with a '.'
1. When you've finished with your fix or feature:
    - `git fetch upstream master`
    - `git rebase upstream/master`
    - submit a pull request directly to master. Include a description of your changes.
1. Your pull request will be reviewed by another maintainer. The point of code reviews is to help keep the codebase clean and of high quality.
1. Fix any issues raised by your code reviewer, and push your fixes as a single new commit.
1. Once the pull request has been reviewed, it will be merged by another member of the team. Do not merge your own pull requests.

### Guidelines

1. Uphold the current code standard:
    - Keep your code DRY.
    - Follow [STYLE_GUIDE.md](STYLE_GUIDE.md)
1. Run the tests before submitting a pull request.
1. Submit tests if your pull request contains new, testable behavior.


**Thanks for contributing!**