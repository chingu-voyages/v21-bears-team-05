const traversePath = (root, path) => path && path.length === 0 ? root : traversePath(root[path.shift()], path)

export default traversePath