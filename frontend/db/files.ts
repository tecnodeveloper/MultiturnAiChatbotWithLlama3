import { createBrowserSupabaseClient } from "@/lib/supabase";

const supabase = createBrowserSupabaseClient();

export const uploadFile = async (
  file: File,
  chatId: string,
  userId: string
) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${chatId}/${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("chat_files")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: fileRecord, error: dbError } = await supabase
    .from("files")
    .insert([
      {
        name: file.name,
        path: filePath,
        user_id: userId,
        chat_id: chatId,
        type: file.type,
        size: file.size,
      },
    ])
    .select("*")
    .single();

  if (dbError) {
    throw new Error(dbError.message);
  }

  return fileRecord;
};

export const getFilesByChatId = async (chatId: string) => {
  const { data, error } = await supabase
    .from("files")
    .select("*")
    .eq("chat_id", chatId);

  if (error) throw new Error(error.message);
  return data;
};
