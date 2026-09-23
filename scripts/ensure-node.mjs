const major = Number(process.versions.node.split('.')[0])

if (major < 18) {
  console.error(
    `\n需要 Node.js 18 或更高版本，当前为 ${process.version}。\n` +
      '请执行：nvm install 20 && nvm use 20\n'
  )
  process.exit(1)
}
