import fs from 'fs'
import path from 'path'

const packagePath = path.resolve(process.cwd(), 'package.json')
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))

const parts = pkg.version.split('.')
parts[2] = parseInt(parts[2]) + 1
pkg.version = parts.join('.')

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n')
console.log(`Version bumped to ${pkg.version}`)
