using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace Spherag_frontend_andres.Services
{
    public class ApiResponse
    {
        public required Int32 AtlasElementId { get; set; }
        public required float BatteryPercentage { get; set; }
        public required float SignalPercentage { get; set; }
        public required string LastUpdatedDate { get; set; }
        public required string Gmt { get; set; }
        public required string CreationDate { get; set; }
        public required string AtlasEnd { get; set; }
        public AccumulatedFlowData? AccumulatedFlowData { get; set; }
        public FlowRateData? FlowRateData { get; set; }
        public string? SensorData { get; set; }
        public string? OutputData { get; set; }
        public string? DigitalInputData { get; set; }
    }

    public class AccumulatedFlowData {
        public Log[]? Logs {get;set;}
        public DataStamp[]? Data { get; set; }
        public string? Channel { get; set; }
        public Int32 UnitTypeId { get; set; }
        public required string Name { get; set; }
        public required string Symbol { get; set; }
        public Int32 UnitTypeGroupId { get; set; }
        
    }
    public class FlowRateData {
        public Log[]? Logs { get; set; }
        public DataStamp[]? Data { get; set; }
        public string? Channel { get; set; }
        public Int32 UnitTypeId { get; set; }
        public required string Name { get; set; }
        public required string Symbol { get; set; }
        public Int32 UnitTypeGroupId { get; set; }
    }

    public class Log {
        public Int64 DateTS { get; set;  }
        public Int16 Origin { get; set; }
        public Int32 ResultAction { get; set; }
        public required Data[] Data { get; set; }
    }

    public class Data { 
        public float Value { get; set; }
        public Int32 UnitTypeId { get; set; }
        public required string Name { get; set; }
        public required string Symbol { get; set; }
        public Int32 UnitTypeGroupId { get; set; }
        public string? Channel { get; set; }
    }

    public class DataStamp { 
        public float Vvalue { get; set; }
        public Int64 TS { get; set; }
    }
}
