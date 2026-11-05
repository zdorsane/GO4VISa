import { Icon } from "@/components/ui/Icon";

/** Every ISO country flag ships in public/flags (from flag-icons; emoji flags do not render on Windows). */
const AVAILABLE = new Set(
  "ad ae af ag ai al am ao aq ar as at au aw ax az ba bb bd be bf bg bh bi bj bl bm bn bo bq br bs bt bv bw by bz ca cc cd cf cg ch ci ck cl cm cn co cp cr cu cv cw cx cy cz de dg dj dk dm do dz ec ee eg eh er es et eu fi fj fk fm fo fr ga gb gd ge gf gg gh gi gl gm gn gp gq gr gs gt gu gw gy hk hm hn hr ht hu ic id ie il im in io iq ir is it je jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md me mf mg mh mk ml mm mn mo mp mq mr ms mt mu mv mw mx my mz na nc ne nf ng ni nl no np nr nu nz om pa pc pe pf pg ph pk pl pm pn pr ps pt pw py qa re ro rs ru rw sa sb sc sd se sg sh si sj sk sl sm sn so sr ss st sv sx sy sz tc td tf tg th tj tk tl tm tn to tr tt tv tw tz ua ug um un us uy uz va vc ve vg vi vn vu wf ws xk xx ye yt za zm zw".split(" "),
);

export function Flag({ code, className = "h-4 w-6" }: { code: string | null | undefined; className?: string }) {
  const c = code?.toLowerCase();
  if (!c || !AVAILABLE.has(c)) return <Icon name="globe" className={className.replace(/w-\S+/, "") + " text-ocean"} aria-hidden />;
  // eslint-disable-next-line @next/next/no-img-element -- tiny local SVGs
  return <img src={`/flags/${c}.svg`} alt="" aria-hidden className={`${className} shrink-0 rounded-[3px] object-cover shadow-sm ring-1 ring-black/5`} />;
}
