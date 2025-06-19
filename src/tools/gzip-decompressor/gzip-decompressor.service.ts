export async function decompress(url: string) {
  const ds = new DecompressionStream('gzip');
  const response = await fetch(`data:application/octet-stream;base64,${url}`);
  const blob_in = await response.blob();
  const stream_in = blob_in.stream().pipeThrough(ds);
  const blob_out = await new Response(stream_in).blob();
  return await blob_out.text();
}
