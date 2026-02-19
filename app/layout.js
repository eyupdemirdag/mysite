export const metadata = {
  title: 'My Travel Blog',
  description: 'Coming soon – travel blog and photo gallery',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
