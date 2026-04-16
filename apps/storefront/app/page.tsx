export default function Home() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>

      {/* HERO */}
      <section style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        padding: '100px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px' }}>Hello from Abrar</h1>
        <p style={{ maxWidth: '700px', margin: '20px auto' }}>
          Next.js static export with external images — works on Hostinger shared hosting.
        </p>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '60px 20px', background: '#f9fafb' }}>
        <h2 style={{ textAlign: 'center' }}>Features</h2>

        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '1100px',
          margin: '40px auto'
        }}>
          {[
            {
              title: 'Fast',
              img: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
              text: 'Static files load instantly.'
            },
            {
              title: 'Secure',
              img: 'https://cdn-icons-png.flaticon.com/512/3064/3064197.png',
              text: 'No backend means fewer attacks.'
            },
            {
              title: 'Cheap Hosting',
              img: 'https://cdn-icons-png.flaticon.com/512/1256/1256650.png',
              text: 'Runs on shared hosting.'
            }
          ].map(item => (
            <div key={item.title} style={{
              background: '#fff',
              padding: '25px',
              width: '280px',
              borderRadius: '8px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,.08)'
            }}>
              <img
                src={item.img}
                alt={item.title}
                style={{ width: '80px', marginBottom: '15px' }}
              />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTENT WITH LOCAL IMAGE */}
      <section style={{
        padding: '60px 20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <h2>Works with Local Images</h2>
        <p>
          Images inside the <code>public</code> folder are copied automatically during export.
        </p>

        <img
          src="images/sample.jpg"
          alt="Sample local"
          style={{
            width: '100%',
            maxWidth: '600px',
            display: 'block',
            margin: '30px auto',
            borderRadius: '10px'
          }}
        />
      </section>

      {/* FOOTER */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        background: '#111827',
        color: '#9ca3af'
      }}>
        © {new Date().getFullYear()} Abrar · Static Next.js with Images
      </footer>

    </main>
  );
}
