import dns from 'dns'

export const getMx = async (domain: string): Promise<dns.MxRecord[]> => {
  return new Promise(r =>
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses) return r([] as dns.MxRecord[])
      r(addresses)
    })
  )
}

export const getBestMx = async (domain: string): Promise<dns.MxRecord | undefined> => {
  const addresses = await getMx(domain)
  // Return undefined if no MX records
  if (addresses.length === 0) return undefined

  // Check for null MX record (dot) or empty exchange
  const hasNullMx = addresses.some(record => record.exchange === '.' || record.exchange === '')
  if (hasNullMx) return undefined

  let bestIndex = 0

  for (let i = 0; i < addresses.length; i++) {
    if (addresses[i].priority < addresses[bestIndex].priority) {
      bestIndex = i
    }
  }

  return addresses[bestIndex]
}
