import "@/styles/globals.css";

export const metadata = {
    title: 'UvgMatch'
}

const RootLayout = ({children}) => {
  return (
    <html lang="es">
        <head>
            <title>{metadata.title}</title>
            <meta name="description" content={metadata.description} />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta property="og:title" content={metadata.title} />
            <meta property="og:description" content={metadata.description} />
            <meta name="keywords" content="coffee "></meta>            
        </head>
        <body>
            <main className='app'>
                {children}
            </main>
        </body>
    </html>
  )
}

export default RootLayout