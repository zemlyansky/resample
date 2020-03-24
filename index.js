module.exports = {
  bootstrap,
  jackknife
}

function randint (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

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

function resample (x, r) {
  var samples = []
  var l = x.length

  for (var i = 0; i < r; i++) {
    var sample = []
    for (var j = 0; j < l; j++) {
      sample.push(x[randint(0, l - 1)])
    }
    samples.push(sample)
  }

  return samples
}

function bootstrap (x, f, r) {
  if ((typeof f === 'number') && (typeof r === 'undefined')) {
    r = f
    f = undefined
  }

  r = r || 10000

  var samples = resample(x, r)

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
