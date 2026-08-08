import { useQuery } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { getPublicStats } from '../../../services/statsService';

interface TermsModalProps {
  /** Nombre del usuario recién registrado, para personalizar el encabezado. */
  userName: string;
  isAccepting: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function TermsModal({
  userName,
  isAccepting,
  onAccept,
  onDecline,
}: TermsModalProps) {
  // El porcentaje sale de la API para que el contrato no lo tenga quemado.
  const { data: stats } = useQuery({
    queryKey: ['public', 'stats'],
    queryFn: getPublicStats,
    staleTime: 5 * 60_000,
  });

  const fee = stats?.platformFeePercentage ?? 7;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-terminos"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b3073]/60 p-4"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-center gap-4 border-b border-[#f4f5fc] px-8 py-6">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e7e8f2] text-[#4d44b5]">
            <ShieldCheck className="size-5" strokeWidth={2} />
          </span>
          <div>
            <h2
              id="titulo-terminos"
              className="font-['Poppins',sans-serif] text-xl font-bold text-[#2b3073]"
            >
              Términos y condiciones
            </h2>
            <p className="font-['Quicksand',sans-serif] text-sm text-[#8b899e]">
              ¡Bienvenido a Rentora, {userName}! Léelos antes de continuar.
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-5 overflow-y-auto px-8 py-6 font-['Quicksand',sans-serif] text-sm leading-relaxed text-[#7d7e93]">
          <section className="flex flex-col gap-1.5">
            <h3 className="font-bold text-[#2b3073]">1. Qué es Rentora</h3>
            <p>
              Rentora es una plataforma que conecta a personas con espacio disponible
              (anfitriones) con personas que necesitan almacenar bienes (inquilinos). Rentora no es
              dueña de los espacios publicados ni es parte del acuerdo de uso entre las partes:
              actúa como intermediaria.
            </p>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="font-bold text-[#2b3073]">2. Tu cuenta</h3>
            <p>
              Debes ser mayor de edad y proporcionar información veraz. Eres responsable de
              mantener la confidencialidad de tu contraseña y de toda la actividad realizada desde
              tu cuenta.
            </p>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="font-bold text-[#2b3073]">3. Publicación de espacios</h3>
            <p>
              Todo espacio publicado pasa por una revisión antes de aparecer en la búsqueda.
              Rentora puede rechazar o retirar un anuncio que incumpla estos términos, indicando el
              motivo. Declaras que tienes derecho a alquilar el espacio que publicas.
            </p>
          </section>

          <section className="flex flex-col gap-1.5 rounded-2xl bg-[#f4f5fc] p-4">
            <h3 className="font-bold text-[#2b3073]">4. Comisión de la plataforma</h3>
            <p>
              <strong className="text-[#2b3073]">
                Rentora cobra una comisión del {fee}% sobre el monto total de cada reserva.
              </strong>{' '}
              La comisión se descuenta del pago que recibe el anfitrión: si una reserva suma L
              10,000, Rentora retiene L {((10000 * fee) / 100).toLocaleString('en-US')} y el
              anfitrión recibe L {(10000 - (10000 * fee) / 100).toLocaleString('en-US')}. El monto
              exacto se te muestra en cada solicitud antes de que la aceptes.
            </p>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="font-bold text-[#2b3073]">5. Reservas y pagos</h3>
            <p>
              El inquilino solicita la reserva y el anfitrión decide si la acepta. Actualmente
              Rentora no procesa pagos en línea: el cobro se coordina directamente entre las partes
              por los medios que acuerden, y la comisión se liquida con el anfitrión.
            </p>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="font-bold text-[#2b3073]">6. Uso permitido del espacio</h3>
            <p>
              Queda prohibido almacenar sustancias ilegales, explosivos, material inflamable,
              armas, animales vivos, alimentos perecederos o cualquier bien cuya tenencia infrinja
              la ley hondureña. El inquilino responde por los daños que ocasione al espacio.
            </p>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="font-bold text-[#2b3073]">7. Cancelaciones</h3>
            <p>
              Tanto el anfitrión como el inquilino pueden cancelar una reserva indicando el motivo.
              Las cancelaciones reiteradas sin causa justificada pueden derivar en la suspensión de
              la cuenta.
            </p>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="font-bold text-[#2b3073]">8. Reseñas</h3>
            <p>
              Al finalizar un alquiler, ambas partes pueden calificarse. Las reseñas deben basarse
              en la experiencia real; Rentora puede ocultar contenido ofensivo o falso.
            </p>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="font-bold text-[#2b3073]">9. Suspensión de cuentas</h3>
            <p>
              Rentora puede suspender o cancelar cuentas que incumplan estos términos, con o sin
              aviso previo según la gravedad del caso.
            </p>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="font-bold text-[#2b3073]">10. Datos personales</h3>
            <p>
              Usamos tus datos para operar la plataforma: mostrar tu perfil a la otra parte de una
              reserva, enviarte notificaciones y dar soporte. No los vendemos a terceros. Puedes
              corregirlos desde tu perfil.
            </p>
          </section>

          <section className="flex flex-col gap-1.5">
            <h3 className="font-bold text-[#2b3073]">11. Cambios en los términos</h3>
            <p>
              Si estos términos cambian, te lo notificaremos dentro de la plataforma. Seguir usando
              Rentora después del aviso significa que aceptas la nueva versión.
            </p>
          </section>
        </div>

        <footer className="flex flex-col gap-3 border-t border-[#f4f5fc] bg-[#fbfbff] px-8 py-5 sm:flex-row-reverse sm:items-center">
          <button
            type="button"
            onClick={onAccept}
            disabled={isAccepting}
            className="rounded-full bg-[#4d44b5] px-6 py-3.5 font-['Poppins',sans-serif] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {isAccepting ? 'Guardando...' : 'Acepto los términos y condiciones'}
          </button>
          <button
            type="button"
            onClick={onDecline}
            disabled={isAccepting}
            className="rounded-full px-6 py-3.5 font-['Quicksand',sans-serif] text-sm font-semibold text-[#8b899e] transition-colors hover:text-[#2b3073] disabled:opacity-40"
          >
            No acepto
          </button>
          <p className="font-['Quicksand',sans-serif] text-xs text-[#a098ae] sm:mr-auto">
            Para usar Rentora debes aceptar estos términos.
          </p>
        </footer>
      </div>
    </div>
  );
}
