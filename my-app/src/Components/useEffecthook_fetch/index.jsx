import React, { useState, useEffect } from 'react'
import Cache from '../cache'

let caches = []

function Demo() {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    async function getData() {
      try {
        //这里的caches不是复用组件
        const target = caches.find((query) => { return query.pageQuery === inputValue && query.pageSize === page })
        if (target) {
          console.log(target)
          setList(target.pageData)
        } else {
          if (inputValue !== '') {
            const response = await fetch(
              `https://api.github.com/search/repositories?q=${inputValue}&page=${page}`
            )
            setLoading(false)
            const data = await response.json()
            console.log(data)
            setList(data.items)
            Cache({ page }, { inputValue }, data)
            // if (caches.length >= 5) {
            //   caches = caches.slice(-4).concat({ pageSize: page, pageData: data.items, pageQuery: inputValue })
            // } else {
            //   caches.push({ pageSize: page, pageQuery: inputValue, pageData: data.items })
            // }
            // console.log("缓存的数组长度：" + caches.length)
          }
        }
      } catch (error) {
        console.log('请求出错', error)
      }
    }
    getData()
  }, [inputValue, page])

  function onKeyDownchange(e) {
    if (e.keyCode === 13) {
      if (!e.target.value.match("^[a-zA-Z0-9_\u4e00-\u9fa5]+$")) {
        alert("请不要输入特殊字符!");
        setInputValue('')
        console.log({ inputValue })
      } else {
        setInputValue(e.target.value)
        setLoading(true)
      }
    }
  }

  return (
    <div>
      请输入搜索关键词：
      <input onKeyDown={e => onKeyDownchange(e)} />
      {isLoading ? <strong>loading </strong> :
        <div>
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
          &nbsp;
          <button onClick={() => setPage(page + 1)}>[下一页按钮]</button>&nbsp;
          [{page}/ 总页数]
        </div >
      }


    </div >
  )
}

export default Demo
