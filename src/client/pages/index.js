import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import { io } from 'socket.io-client'

const socket = io('http://localhost:8000')

export default function Home() {
  const handleChangeInput = (e) => {
    console.log(e.target.value)
    socket.emit('join', { message: e.target.value })
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Next Chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </h3>
          <div>
            messages
          </div>
          <div>
            <input type="text" onChange={handleChangeInput} />
          </div>
        </div>
        <div style={{ height: '100%', width: '20%' }}>
          contacts
        </div>
      </main>
    </div>
  )
}
