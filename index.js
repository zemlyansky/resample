module.exports = {
  bootstrap,
  jackknife,
  resample,
  shuffle
}

// function randint (min, max) {
//   min = Math.ceil(min)
//   max = Math.floor(max)
//   return Math.floor(Math.random() * (max - min + 1)) + min
// }

function average (x) {
  return x.reduce((a, b) => a + b) / x.length
}

function sd (x, m) {
  m = m || average(x)

  var diffsq = x.map((val) => {
    var diff = val - m
    return diff * diff
  })

  return Math.sqrt(diffsq.reduce((a, b) => a + b) / (x.length - 1))
}

function resample (...arrays) {
  const lastParam = arrays[arrays.length - 1]
  const options = {
    replace: true,
    nSamples: null
  }
  if (typeof lastParam === 'object' && !Array.isArray(lastParam)) {
    Object.assign(options, arrays.pop(1))
  }
  if (arrays.length === 0 || arrays.some(arr => !Array.isArray(arr))) {
    throw new Error('Provide array(s) as arguments')
  }
  const len = arrays[0].length
  options.nSamples = options.nSamples || len
  if (arrays.some(arr => arr.length !== len)) {
    throw new Error('Array(s) should have same length')
  }
  if (options.replace === false && options.nSamples > len) {
    throw new Error('When sampling without replacement nSamples should be less than array length')
  }

  const res = arrays.map(_ => [])
  const idx = arrays[0].map((_, i) => i)

  for (let i = 0; i < options.nSamples; i++) {
    const j = Math.floor(Math.random() * idx.length)
    const k = options.replace ? idx[j] : idx.splice(j, 1)[0]
    arrays.forEach((arr, l) => {
      res[l].push(JSON.parse(JSON.stringify(arr[k])))
    })
  }
  return res.length > 1 ? res : res[0]
}

function shuffle (...arrays) {
  arrays.push({
    replace: false
  })
  return resample.apply(null, arrays)
}

function bootstrap (x, f, r) {
  if ((typeof f === 'number') && (typeof r === 'undefined')) {
    r = f
    f = undefined
  }

  r = r || 10000

  var samples = Array(r).fill(0).map(_ => resample(x))

  if (typeof f === 'function') {
    var observed = f(x)
    var replicates = samples.map(s => f(s))
    var mean = average(replicates)
    var se = sd(replicates, mean)
    var bias = mean - observed

    return {
      samples,
      replicates,
      observed,
      mean,
      se,
      bias
    }
  } else {
    return samples
  }
}

function jackknife (x, f) {
  var samples = x.map((v, i) => x.filter((_, j) => j !== i))
  var n = x.length

  if (typeof f === 'function') {
    var observed = f(x)
    var replicates = samples.map(s => f(s))
    var mean = average(replicates)
    var se = (n - 1) / Math.sqrt(n) * sd(replicates, mean)
    var bias = (n - 1) * (mean - observed)

    return {
      samples,
      replicates,
      observed,
      mean,
      se,
      bias
    }
  } else {
    return samples
  }
}
