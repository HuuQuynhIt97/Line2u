using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace Evse.Helpers.Line
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
