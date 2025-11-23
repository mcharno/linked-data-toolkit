
package net.charno.utils;

import java.util.Comparator;
import java.util.Map;
import java.util.TreeMap;

/**
 * Based on code lifted from hmkcode.com <http://hmkcode.com/sorting-java-map-by-key-value/>.
 * 
 * @author mcharno <michael@charno.net>
 */
public class MapSort {
    
    public static Map<String,String> sortByValue(Map<String,String> unsortedMap) {
        Map<String,String> sortedMap = new TreeMap<String, String>(new ValueComparator(unsortedMap));
        sortedMap.putAll(unsortedMap);
        return sortedMap;
    }
    
    public static Map<String,String> sortByKey(Map<String,String> unsortedMap) {
        Map<String,String> sortedMap = new TreeMap<String, String>();
        sortedMap.putAll(unsortedMap);
        return sortedMap;
    }
}

class ValueComparator implements Comparator {
    
    Map map;
    
    public ValueComparator(Map map) {
        this.map = map;
    }

    public int compare(Object key1, Object key2) {
        Comparable value1 = (Comparable) map.get(key1);
        Comparable value2 = (Comparable) map.get(key2);
        return value1.compareTo(value2);
    }
}
