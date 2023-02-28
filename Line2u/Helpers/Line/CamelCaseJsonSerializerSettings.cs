using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace Line2u.Helpers.Line
{
    internal class CamelCaseJsonSerializerSettings : JsonSerializerSettings
    {
        [System.Obsolete]
        public CamelCaseJsonSerializerSettings()
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver();
            Converters.Add(new StringEnumConverter { CamelCaseText = true });
            NullValueHandling = NullValueHandling.Ignore;
        }
    }
}
