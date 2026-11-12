export function corsHeaders(request: Request): Record<string,string> | null {
  const origin = request.headers.get('origin') || '';
  const allowed = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(x=>x.trim()).filter(Boolean);
  if (!origin || !allowed.includes(origin)) return null;
  return {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'content-type, x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin'};
}
export const json = (body: unknown,status=200,headers:Record<string,string>={}) =>
  new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});
