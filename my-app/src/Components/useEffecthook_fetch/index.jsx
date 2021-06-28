import React, { useState, useEffect } from 'react'

let caches = []

function Demo() {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    async function getData() {
      try {
        const target = caches.find((query) => { return query.pageQuery === inputValue && query.pageSize === page })
        if (target) {
          console.log(target)
          setList(target.pageData)
        } else {
          if (inputValue !== '') {
            const response = await fetch(
              `https://api.github.com/search/repositories?q=${inputValue}&page=${page}`
            )
            const data = await response.json()
            console.log(data)
            setList(data.items)
            if (caches.length >= 5) {
              caches = caches.slice(-4).concat({ pageSize: page, pageData: data.items, pageQuery: inputValue })
            } else {
              caches.push({ pageSize: page, pageQuery: inputValue, pageData: data.items })
            }
            console.log(caches.length)
          }
        }
      } catch (error) {
        console.log('请求出错', error)
      }
    }
    getData()
  }, [inputValue, page])

  return (
    <div>
      请输入搜索关键词：
      <input onChange={e => setInputValue(e.target.value)} />
      <ul>
        <li>- ⭐ - 🍴</li>
        {list.map(repo => {
          return (
            <li key={repo.id}>
              {repo.full_name} - ⭐{repo.stargazers_count} - 🍴{repo.forks_count}
            </li>
          )
        })}
      </ul>
      <button
        onClick={() => {
          if (page > 1) {
            setPage(page - 1)
          } else {
            alert('当前为第一页！')
          }
        }}
      >
        [上一页按钮]
      </button>
      <button onClick={() => setPage(page + 1)}>[下一页按钮]</button>[{page}
      /总页数]
    </div>
  )
}

export default Demo
