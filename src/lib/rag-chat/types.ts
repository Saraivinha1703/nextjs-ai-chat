export type SymbolSearchObject = {
  symbol: string;
  instrument_name: string;
  exchange: string;
  mic_code: string;
  exchange_timezone: string;
  instrument_type: string;
  country: string;
  currency: string;
};

export type Actions = {
  submitUserMessageRAGChat: (content: string) => Promise<{
    id: string;
    display: JSX.Element;
  }>;
};
