import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center text-white bg-black">
      <h1 className="text-4xl font-light">404 - Página no encontrada</h1>
      <p className="mt-4">La página que buscás no existe.</p>
      <Link href="/" className="mt-6 underline underline-offset-4 text-primary">
        Volver al inicio
      </Link>
    </div>
  );
}