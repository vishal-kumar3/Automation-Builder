'use client'
import dynamic from 'next/dynamic';
import "@uploadcare/react-uploader/core.css";
import { useRouter } from 'next/navigation';

type Props = {
  onUpload: (e : string) => any
};

const FileUploaderRegular = dynamic(
  () => import("@uploadcare/react-uploader").then((mod) => mod.FileUploaderRegular),
  { ssr: false }
);

const UploadCareButton = ({ onUpload }: Props) => {

  const router = useRouter();

  const handleFileUploadEvent = async (items : any) => {
    const profileImage = items.allEntries.filter((file: any) => file.status === 'success')
    console.log(profileImage[0]?.cdnUrl)

    if(profileImage[0]?.cdnUrl){
      const response = await onUpload(profileImage[0]?.cdnUrl)
      console.log("Upload response: ", response)
      if(response){
        router.refresh()
      }
    }
  }

  return (
    <div>
      <FileUploaderRegular
        onChange={handleFileUploadEvent}
        ctxName='my-uploader'
        pubkey="511e1df4c0a33fe1a180"
        maxLocalFileSizeBytes={10000000}
        multiple={false}
        imgOnly={true}
        sourceList="local, url, camera, dropbox, gdrive, gphotos"
        classNameUploader="my-config"
      />
    </div>
  );
};

export default UploadCareButton;
