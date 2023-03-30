import React from 'react'

const navigation = [
    {
        name: 'Contact',
        href: 'mailto:gavin.sidhu@uplevelhq.com',
    },
]

const Footer = () => {
    return (
        <footer className='bottom-0'>
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2">
                    {navigation.map((item) => (
                        <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                            <span>{item.name}</span>
                        </a>
                    ))}
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs leading-5 text-gray-500">
                        &copy; 2023 Uplevel HQ LLC. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer