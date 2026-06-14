import About from "@/components/About";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Resources from "@/components/Resources";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Resources />
      </main>
      <Footer />
    </>
  );
}
