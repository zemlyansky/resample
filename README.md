# resample
Resampling methods for variance and bias estimation. Currently implemented such techniques:
* Bootstrap
* Jackknife

*no tests yet*

`resample` generates new samples from an input array and applies to them passed function to generate multiple estimation replicates. 
Then those replicates are used to calculate mean, bias and standard error of an estimate

## Install
```
npm i -S resample
```

## Usage

```javascript
var { bootstrap, jackknife } = require('resample')

function mean (array) {
  return array.reduce((a, b) => a + b) / array.length
}

bootstrap([1, 2, 3, 4, 5, 6, 40], mean)
// { observed: 8.71, mean: 8.74, se: 4.84, bias: 0.029, replicates: [...], samples: [...] }

```

The bootstrap method supports an extra parameter that sets number of samples/iterations (default: 10000)

```javascript
bootstrap([1, 2, 3, 4, 5, 6, 40], mean, 10000)
```

Passing only number of samples without the estimator function return raw samples with replacement

```javscript
bootstrap([1, 2, 3, 4, 5, 6, 40], 2))
// [[ 2, 40, 1, 1, 5, 2, 6], [2, 3, 4, 4, 2, 40, 6]]
```
