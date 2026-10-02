# Add Form Validation

Extend `LoginForm` so it validates email format and a minimum password length (8 characters), shows inline error messages, and disables the submit button until both fields are valid.

## Done when

- An invalid email shows an error mentioning "email".
- A password under 8 characters shows an error mentioning length.
- Submit is disabled while invalid.
- Submit is enabled once both fields pass.

## How to submit

1. `git checkout -b task`
2. Build it, committing as you go — small commits, clear messages.
3. `git push -u origin task`
4. Open a pull request, then paste its URL back into OpenExp.

Your checks run automatically when you open the pull request.
