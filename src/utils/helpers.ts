import { City, Region } from '../types/enum/activity';

/**
 * 檢查是否為 string
 * @param input
 * @returns
 */
export function isString(input: any) {
  return typeof input === 'string' && Object.prototype.toString.call(input) === '[object String]';
}

/**
 * 依照城市轉換為地區
 * @param city
 * @returns Region
 */
export function convertCityToArea(city: string = ''): Region {
  let region = Region.Overseas;

  // 北部：臺北市、新北市、基隆市、新竹市、新竹縣、桃園市、宜蘭縣
  if (
    (
      [
        City.Taipei,
        City.NewTaipei,
        City.Keelung,
        City.HsinchuCity,
        City.HsinchuCounty,
        City.Taoyuan,
        City.Yilan
      ] as string[]
    ).includes(city)
  ) {
    region = Region.Northern;
  }

  // 中部：臺中市、苗栗縣、彰化縣、南投縣及雲林縣
  if (
    ([City.Taichung, City.Miaoli, City.Changhua, City.Nantou, City.Yunlin] as string[]).includes(
      city
    )
  ) {
    region = Region.Central;
  }

  // 南部：高雄市、臺南市、嘉義市、嘉義縣、屏東縣及澎湖縣
  if (
    (
      [
        City.Kaohsiung,
        City.Tainan,
        City.ChiayiCity,
        City.ChiayiCounty,
        City.Pingtung,
        City.Penghu
      ] as string[]
    ).includes(city)
  ) {
    region = Region.Southern;
  }

  // 東部：花蓮縣、臺東縣
  if (([City.Hualien, City.Taitung] as string[]).includes(city)) {
    region = Region.Eastern;
  }

  return region;
}
