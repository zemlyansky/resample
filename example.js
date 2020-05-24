const { bootstrap, jackknife, resample, shuffle } = require('.')

function mean (array) {
  return array.reduce((a, b) => a + b) / array.length
}

console.log(bootstrap([1, 2, 3, 4, 5, 6, 40], 5))
console.log(bootstrap([1, 2, 3, 4, 5, 6, 40], mean))
console.log(bootstrap([1, 2, 3, 4, 5, 6, 40], mean, 10))
console.log(jackknife([1, 2, 3, 4, 5, 6, 40], mean))
console.log(shuffle([1, 2, 3, 4, 5, 6, 7], ['a', 'b', 'c', 'd', 'e', 'f', 'g']))
console.log(resample([1, 2, 3, 4, 5, 6, 7], ['a', 'b', 'c', 'd', 'e', 'f', 'g'], { nSamples: 10 }))
