export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['**/dist/**'],
  rules: {
    // Independent component selectors need not follow global specificity order.
    'no-descending-specificity': null,
    'import-notation': 'string',
    'selector-class-pattern': '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'apply',
          'reference',
          'config',
          'plugin',
        ],
      },
    ],
  },
};
