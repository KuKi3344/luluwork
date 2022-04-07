export function formatTime(time) {
  let d = time.replace('T',' ').replace('.000Z','')
  let d2 = Date.parse(d)
  const now = Date.now()

  const diff = (now - d2) / 1000

  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }

  return d
}
