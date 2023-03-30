import React from 'react'
import Footer from './Footer'
import Navbar from './Navbar'

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <>
            <Navbar />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
            <Footer />
        </>

    )
}

export default Layout