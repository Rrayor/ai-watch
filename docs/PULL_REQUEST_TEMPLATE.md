# Pull Request

## 📋 Description

### Summary
<!-- Provide a clear and concise description of what this PR does -->

### Type of Change
<!-- Check all that apply -->
- [ ] 🐛 Bug fix (non-breaking change that fixes an issue)
- [ ] ✨ New feature (non-breaking change that adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🧹 Code refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test improvements
- [ ] 🔧 Build/CI changes

### Related Issues
<!-- Link to related issues using GitHub keywords -->
- Fixes #(issue number)
- Closes #(issue number)
- Related to #(issue number)

## 🧪 Testing

### Test Coverage
- [ ] All new functionality has comprehensive tests
- [ ] All existing tests continue to pass
- [ ] Test coverage remains high (check coverage report)
- [ ] Manual testing completed

### Manual Testing Checklist
<!-- Check all that were tested -->
- [ ] VS Code commands work correctly
- [ ] Language Model Tools function properly
- [ ] Error handling works as expected
- [ ] Documentation examples are accurate
- [ ] Configuration changes work correctly

## 📖 Documentation

### Documentation Updates
<!-- Check all documentation that was updated according to CONTRIBUTING.md guidelines -->
- [ ] **README.md** - Updated for major features/changes
- [ ] **docs/USER_GUIDE.md** - Updated for user-facing changes
- [ ] **docs/API_REFERENCE.md** - Updated for API changes
- [ ] **docs/ARCHITECTURE.md** - Updated for architectural changes
- [ ] **docs/CONFIGURATION.md** - Updated for setting changes
- [ ] **docs/TESTING.md** - Updated for testing changes
- [ ] **CONTRIBUTING.md** - Updated for process changes
- [ ] **CHANGELOG.md** - Entry added for this change

### Documentation Validation
- [ ] All code examples tested and working
- [ ] Cross-references between docs updated
- [ ] No hardcoded numbers (test counts, versions) added
- [ ] Consistent terminology used throughout

## ✅ Code Quality

### Code Standards
- [ ] Code follows existing style and conventions
- [ ] TypeScript types are properly defined
- [ ] JSDoc comments added for public APIs
- [ ] Error handling is comprehensive
- [ ] Input validation is thorough

### Architecture Compliance
- [ ] Changes follow the modular architecture pattern
- [ ] Code is in the correct layer (utils/commands/tools/types)
- [ ] Proper separation of concerns maintained
- [ ] No circular dependencies introduced

### Performance
- [ ] No performance regressions introduced
- [ ] Efficient algorithms and data structures used
- [ ] Memory usage is reasonable
- [ ] No blocking operations on main thread

## 🔄 Build & CI

### Build Status
- [ ] `npm run compile` passes
- [ ] `npm run lint` passes with no errors
- [ ] `npm test` passes all tests
- [ ] No TypeScript compilation errors

### Package Changes
<!-- If package.json was modified -->
- [ ] Dependencies added are necessary and justified
- [ ] Version bumping follows semantic versioning
- [ ] Language Model Tool definitions are correct
- [ ] VS Code command registrations are proper

## 🚀 Deployment

### Breaking Changes
<!-- If this introduces breaking changes -->
- [ ] Breaking changes are clearly documented
- [ ] Migration guide provided (if needed)
- [ ] Version number incremented appropriately
- [ ] Backward compatibility considered

### Release Readiness
- [ ] Ready for immediate release
- [ ] Requires additional testing
- [ ] Part of larger feature set
- [ ] Documentation-only change

## 🔍 Review Checklist

### For Reviewers
Please ensure the following before approving:

#### Functional Review
- [ ] Feature works as described
- [ ] Edge cases are handled properly
- [ ] Error messages are user-friendly
- [ ] Integration with VS Code APIs is correct

#### Code Review
- [ ] Code is readable and maintainable
- [ ] No code duplication or redundancy
- [ ] Proper error handling throughout
- [ ] Security considerations addressed

#### Documentation Review
- [ ] All documentation updates are accurate
- [ ] Examples work as shown
- [ ] API documentation matches implementation
- [ ] User guide reflects new functionality

#### Testing Review
- [ ] Test coverage is adequate
- [ ] Tests are meaningful and thorough
- [ ] No flaky or unreliable tests
- [ ] Integration tests cover key workflows

## 💬 Additional Notes

### Dependencies
<!-- List any new dependencies and justify their inclusion -->

### Future Work
<!-- Note any follow-up work or improvements planned -->

### Screenshots/Examples
<!-- Include screenshots or examples if applicable -->

---

## 📋 Reviewer Instructions

### Priority Review Areas
1. **Architecture Compliance** - Ensure changes follow the modular structure
2. **Documentation Accuracy** - Verify all examples work and docs are updated
3. **Test Coverage** - Confirm comprehensive testing of new functionality
4. **API Consistency** - Check that new APIs follow existing patterns

### Testing Recommendations
1. Run the full test suite: `npm test`
2. Test VS Code integration manually
3. Verify Language Model Tools work correctly
4. Check documentation examples

### Questions to Consider
- Does this change align with the project's goals?
- Are there any security implications?
- Will this scale appropriately?
- Is the user experience intuitive?

---

**Thank you for contributing to AI Watch! 🕐**
