using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Evse.Helpers
{
    public static class MyUtility
    {
        private static readonly string _Salt = "K6KVX-6NWTF-2JPJ3-Q29H6-H8RC6";
        public static string ToEncryptPassword(this string password)
        {
            if (string.IsNullOrEmpty(password)) return "";
            var ASCIIENC = new ASCIIEncoding();
            string strreturn;
            strreturn = string.Empty;
            var bytesourcetxt = ASCIIENC.GetBytes(password);
            var SHA1Hash = new SHA1CryptoServiceProvider();
            byte[] bytehash = SHA1Hash.ComputeHash(bytesourcetxt);
            foreach (byte b in bytehash)
                strreturn += b.ToString("X2");
            return strreturn;
        }

        public static string ToEncrypt(this string password, string salt = "")
        {
            if (string.IsNullOrEmpty(salt))
                salt = _Salt;
            var data = Encoding.UTF8.GetBytes(password);

            using (var md5 = new MD5CryptoServiceProvider())
            {
                var keys = md5.ComputeHash(Encoding.UTF8.GetBytes(salt));
                using (var tripDes = new TripleDESCryptoServiceProvider { Key = keys, Mode = CipherMode.ECB, Padding = PaddingMode.PKCS7 })
                {
                    var transform = tripDes.CreateEncryptor();
                    var results = transform.TransformFinalBlock(data, 0, data.Length);
                    return Convert.ToBase64String(results, 0, results.Length);
                }
            }
        }
        public static Guid? ToGuidNullable(this string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return null;
            }

            try
            {
                Guid result;
                Guid.TryParse(value, out result);
                return result;
            }
            catch
            {
              return null;
            }
        }
         public static Guid ToGuid(this string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return Guid.Empty;
            }

            try
            {
                Guid result;
                Guid.TryParse(value, out result);
                return result;
            }
            catch
            {
              return Guid.Empty;
            }
        }
        public static bool IsBase64(this string base64String)
        {
            if (base64String.Replace(" ", "").Length % 4 != 0)
            {
                return false;
            }

            try
            {
                Convert.FromBase64String(base64String);
                return true;
            }
            catch
            {
                // Handle the exception
            }
            return false;
        }
        public static string ToDecrypt(this string password, string salt = "")
        {
            if (string.IsNullOrEmpty(salt))
                salt = _Salt;
            var data = Convert.FromBase64String(password);
            using (var md5 = new MD5CryptoServiceProvider())
            {
                var keys = md5.ComputeHash(Encoding.UTF8.GetBytes(salt));

                using (var tripDes = new TripleDESCryptoServiceProvider()
                {
                    Key = keys,
                    Mode = CipherMode.ECB,
                    Padding = PaddingMode.PKCS7
                })
                {
                    var transform = tripDes.CreateDecryptor();
                    var results = transform.TransformFinalBlock(data, 0, data.Length);
                    return Encoding.UTF8.GetString(results);
                }
            }
        }

        public static string ToSha256(this string inputString)
        {
            SHA256 sha256 = SHA256.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(inputString + _Salt);
            byte[] hash = sha256.ComputeHash(bytes);
            return hash.GetStringFromHash();
        }

        public static string ToSha512(this string inputString)
        {
            SHA512 sha512 = SHA512.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(inputString + _Salt);
            byte[] hash = sha512.ComputeHash(bytes);
            return hash.GetStringFromHash();
        }

        public static bool VerifyHashedPassword(this string pass, string confirmPass)
        {
            byte[] array1 = Encoding.UTF8.GetBytes(pass);
            byte[] array2 = Encoding.UTF8.GetBytes(confirmPass);
            if (array1.Length != array2.Length)
            {
                return false;
            }

            for (int i = 0; i < array1.Length; i++)
            {
                if (array1[i] != array2[i])
                {
                    return false;
                }
            }
            return true;
        }
        private static string GetStringFromHash(this byte[] hash)
        {
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                result.Append(hash[i].ToString("X2"));
            }
            return result.ToString();
        }
        private static byte[] GenerateSaltedHash(this byte[] plainText, byte[] salt)
        {
            HashAlgorithm algorithm = new SHA256Managed();
            StringBuilder result = new StringBuilder();
            byte[] plainTextWithSaltBytes =
              new byte[plainText.Length + salt.Length];

            for (int i = 0; i < plainText.Length; i++)
            {
                plainTextWithSaltBytes[i] = plainText[i];
            }
            for (int i = 0; i < salt.Length; i++)
            {
                plainTextWithSaltBytes[plainText.Length + i] = salt[i];
            }

            return algorithm.ComputeHash(plainTextWithSaltBytes);
        }

    }

      public class TreeObject
    {
        public object ID { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Image { get; set; } = "";
        public string CssClass { get; set; } = "ngx-org-ceo";
        public Guid Guid { get; set; }
        public Guid? ParentId { get; set; }
        public string Pig_No { get; set; }
        public string Pig_GUID { get; set; }
        public string Parent_GUID { get; set; }
        public string MakeOrder_GUID { get; set; }
        public string Comment { get; set; }
        public bool HasChildren
        {
            get { return Childs.Any(); }
        }
        public IList<TreeObject> Childs { get; set; } = new List<TreeObject>();
        public static List<Guid> GetParents(Dictionary<object, TreeObject> lookup, TreeObject lookFor)
        {
            var list = new List<Guid> { };
            while (lookFor != null)
            {
                if (lookFor.ParentId == null)
                    break;
                // cast ParentId to corrent dataType here Guid or int
                lookup.TryGetValue((Guid)lookFor.ParentId, out var parentNode);
                lookFor = parentNode;
                if (parentNode == null)
                    break;
                list.Add((Guid)lookFor.ParentId);
            }
            return list;
        }

    }
    public static class TreeExtension
    {
        public static IEnumerable<TreeObject> FlatToHierarchy(this List<TreeObject> list)
        {
            // hashtable lookup that allows us to grab references to containers based on id
            var lookup = new Dictionary<object, TreeObject>();
            // actual nested collection to return
            var nested = new List<TreeObject>();

            foreach (TreeObject item in list)
            {
                if (item.ParentId != null && lookup.ContainsKey(item.ParentId))
                {
                    // add to the parent's child list 
                    lookup[item.ParentId].Childs.Add(item);
                }
                else
                {
                    // no parent added yet (or this is the first time)
                    nested.Add(item);
                }
                lookup.Add(item.Guid, item);
            }

            return nested;
        }
    }

}
