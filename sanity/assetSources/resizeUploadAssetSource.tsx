import { useCallback, useRef, useState } from "react";
import { useClient } from "sanity";
import type { AssetSourceComponentProps } from "sanity";
import { Button, Card, Dialog, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { UploadCloud } from "lucide-react";
import { resizeImageFile } from "./resizeImage";

function ResizeUploadSourceComponent({
  onClose,
  onSelect,
}: AssetSourceComponentProps) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setBusy(true);
      setError(null);
      try {
        const { blob, filename } = await resizeImageFile(file);
        const asset = await client.assets.upload("image", blob, { filename });
        onSelect([{ kind: "assetDocumentId", value: asset._id }]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unggah gagal");
      } finally {
        setBusy(false);
      }
    },
    [client, onSelect],
  );

  return (
    <Dialog id="resize-upload" header="Unggah Gambar" onClose={onClose} width={1}>
      <Card padding={4}>
        <Stack space={4}>
          <Text size={1} muted>
            Foto akan diubah ukurannya secara otomatis (maks. 1600px) sebelum
            diunggah.
          </Text>
          {error && <Text size={1}>{error}</Text>}
          {busy ? (
            <Flex justify="center" padding={4}>
              <Spinner />
            </Flex>
          ) : (
            <Button
              text="Pilih Foto"
              icon={UploadCloud}
              onClick={() => inputRef.current?.click()}
            />
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </Stack>
      </Card>
    </Dialog>
  );
}

export const resizeUploadAssetSource = {
  name: "resize-upload",
  title: "Unggah (otomatis diperkecil)",
  component: ResizeUploadSourceComponent,
  icon: UploadCloud,
};
