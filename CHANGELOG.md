# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2026-04-14
### Added
- `replace` option for `fetchRecords`, `fetchRecord`, and `saveRecord` action creators.
  When `replace: true`, individual records from the API response completely overwrite
  their existing versions in the store instead of being deep-merged. Records not in
  the response are preserved. Default behavior (deep merge) is unchanged.

### Fixed
- Corrected `saveRecord` TypeScript definition to match implementation signature.
- Fixed TypeScript compilation errors in selectors caused by nullable `ApiRecord.id`.

## Unreleased
### Added
- TypeScript support

### Fixed
- Fixed issues with immutable state changes and mergeResult method.

## [1.1.6] - 2025-02-03
### Fixed
- Fix TS definitions

## [1.1.5] - 2025-01-19
### Fixed
- Fixed mergeResult method, renamed to resultMerge.  
  The method now returns a new object instead of mutating the original object. 

## [1.1.4] - 2025-01-18
### Fixed
- Use correct typescript definition file name

## [1.1.3] - 2025-01-18
### Fixed
- Updated "main" path in package.json

## [1.1.2] - 2025-01-17
### Fixed
- Immutable mergeResult method

## [1.1.1] - 2025-01-17
### Fixed
- Defined types in package.json

## [1.1.0] - 2025-01-17
### Added
- Added TypeScript definitions