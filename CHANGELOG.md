# Changelog

## [0.3.0](https://github.com/wert2all/adb-logstream/compare/adb-logstream-v0.2.0...adb-logstream-v0.3.0) (2026-06-18)


### Features

* enable npx adb-logstream with HTTP serving and npm publishing ([1fcf93e](https://github.com/wert2all/adb-logstream/commit/1fcf93e56d79c33e1dbf16f18a99d5bd5c235f1b))

## [0.2.0](https://github.com/wert2all/adb-logstream/compare/adb-logstream-v0.1.0...adb-logstream-v0.2.0) (2026-06-18)


### Features

* add uuid for log entry ([25a98d3](https://github.com/wert2all/adb-logstream/commit/25a98d32adcbcb0b3026265ea4e8a0de4d3237cf))
* **client:** add 'a' keybinding to toggle auto-scroll ([9e66df6](https://github.com/wert2all/adb-logstream/commit/9e66df6705f9f1949a04131777e0e7d9288a08e1))
* **client:** add entry selection and clipboard copy ([d2f9a79](https://github.com/wert2all/adb-logstream/commit/d2f9a791f4ff5aa470c16b27a9ca55bbe24104bc))
* **client:** add tooltips for keyboard shortcut controls ([ce46bdd](https://github.com/wert2all/adb-logstream/commit/ce46bdd8d9f3c37fe443d3228adf5666261a949a))
* create notification store ([51a5844](https://github.com/wert2all/adb-logstream/commit/51a5844f7a430af960ebc265791ca40483c985de))
* feat: init monorepo with server + client workspaces ([4fb3756](https://github.com/wert2all/adb-logstream/commit/4fb375630dfb9ccdc4b3210cf7db8f041a88c8df))
* feat(client): add auto-scroll toggle checkbox to footer ([d0fd300](https://github.com/wert2all/adb-logstream/commit/d0fd30059d055a61030a8608864850434178a5ac))
* feat(client): add logcat viewer with filtering and search ([f37898b](https://github.com/wert2all/adb-logstream/commit/f37898ba97c3f653b8733cc54cb64fc4259c9766))
* feat(dev): run server and client in parallel via concurrently ([#1](https://github.com/wert2all/adb-logstream/issues/1)) ([13cdd28](https://github.com/wert2all/adb-logstream/commit/13cdd284c499ea3260899233c8c038428e0c6453))
* feat(server): implement adb logcat WebSocket bridge ([38f9fb9](https://github.com/wert2all/adb-logstream/commit/38f9fb9d1674552df424ef05af45280d9c915f62))
* **footer:** replace ON/OFF text with circular indicator ([ee1ce8c](https://github.com/wert2all/adb-logstream/commit/ee1ce8c3996ffa92cad4250679887d7d7d89c78c))
* switch release automation to google release please via PR ([7c26ebd](https://github.com/wert2all/adb-logstream/commit/7c26ebde320b58e8daffdc8aeabe8dd86dd77ea0))
* update favicon ([fc2da73](https://github.com/wert2all/adb-logstream/commit/fc2da735fb31989590ac9a64969b871df01a0ae0))


### Bug Fixes

* add kbd to  clean button ([0d432c4](https://github.com/wert2all/adb-logstream/commit/0d432c4e2f2aabbbcbb05222bfc361e333a770ef))
* **client:** normalize Escape shortcut to lowercase ([7bac693](https://github.com/wert2all/adb-logstream/commit/7bac6939a636f3612044834bbd4a243ed817e6cb))
* **client:** prevent tooltip clipping and style kbd ([bc78022](https://github.com/wert2all/adb-logstream/commit/bc78022d18420ab3726473a879fdfec0c1811ff1))
* fix angular ([da9128c](https://github.com/wert2all/adb-logstream/commit/da9128cc4003911aa56b54aa023ca9c7e977d6c5))
* fix autoscroll ([c45d7be](https://github.com/wert2all/adb-logstream/commit/c45d7bef0cc87fc0a5f5dc34c856181678c04b59))
* fix autoscroll ([0bc0b94](https://github.com/wert2all/adb-logstream/commit/0bc0b944ecf6ff378944164f61d2d9a1ac124308))
* fix connection status ([9df9ad2](https://github.com/wert2all/adb-logstream/commit/9df9ad2438605ae8972940169433929815ec1696))
* fix design ([8a3356b](https://github.com/wert2all/adb-logstream/commit/8a3356b484f77fb650020c5f21559482bc238e5b))
* fix favicon ([0651286](https://github.com/wert2all/adb-logstream/commit/0651286e6792557545a23df3d6ba6636c23da861))
* fix view of log  row ([5f49fc2](https://github.com/wert2all/adb-logstream/commit/5f49fc208e8a322754f0e919dd89e419f0c754aa))
* move autoscroll value to ng-store ([cdcbe14](https://github.com/wert2all/adb-logstream/commit/cdcbe14814baf3abc55149715fbf8580c00d2281))
* remove useless code ([6fb1c4d](https://github.com/wert2all/adb-logstream/commit/6fb1c4d80b534ecb7eb479a0edd975a88fbb2382))
* remove useless log-state service ([31eea47](https://github.com/wert2all/adb-logstream/commit/31eea474112f8f5602a74d22a8bc501943025a94))
* **render:** disable auto-scroll on manual scroll up ([c39b3c5](https://github.com/wert2all/adb-logstream/commit/c39b3c502074b5dadfe01436ee396eb780a632ef))
* resolve LogcatEntry/LogstreamEntry type mismatch causing build failure ([ceb1f40](https://github.com/wert2all/adb-logstream/commit/ceb1f40939a741faa7a311747f2de5bf05f1015b))
* **server:** use adb logcat with correct header regex ([1e1b3c4](https://github.com/wert2all/adb-logstream/commit/1e1b3c48ffbcfe1bd476640e61c4c969b3c8d664))
* skip keyboard shortcuts when typing in input fields ([2cf21cf](https://github.com/wert2all/adb-logstream/commit/2cf21cfab91159450747cb5324f3b483513114c9))
* **stream:** clear selected entries on filter reset ([ef91d16](https://github.com/wert2all/adb-logstream/commit/ef91d168caf88bb6c427c0c57202a49e1e249040))
* update seaach filter to store ([4f900bc](https://github.com/wert2all/adb-logstream/commit/4f900bc77c16becb6cf1a32db41651e05c52c496))


### Performance Improvements

* **client:** debounce filter input and filter entries on insert ([71f231e](https://github.com/wert2all/adb-logstream/commit/71f231ee91dd5b97be55764706e59d36a0a9f8a4))
