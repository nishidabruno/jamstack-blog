import Image from 'next/image'
import Link from 'next/link'

import logoImg from '../../../public/images/logo.svg'
import { SignInButton } from '../SignInButton'

import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src={logoImg} alt="ig.news" />
        <nav>
          <Link href="/" >
            <a className={styles.active}>Home</a>
          </Link>
          <Link href="/">Posts</Link>
        </nav>
        <SignInButton />
      </div>
    </header>
  )
}