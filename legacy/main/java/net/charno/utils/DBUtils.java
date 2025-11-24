
package net.charno.utils;

/**
 * This is a utility class with static convenience methods for common database
 * actions.
 * 
 * @author mcharno <michael@charno.net>
 */
public class DBUtils {

    /**
     * A convenience method to count the delimeters in a StringBuffer object.
     * 
     * @param sb The StringBuffer that needs delimeters counted.
     * @param delim The delimeter type that needs counting.
     * @return An integer with the total number of delimiters counted.
     */
    public static int countDelims(StringBuffer sb, String delim) {
        int count = 0;
        int index = 0;

        while (index != -1) {
            count++;
            index++;
            index = sb.indexOf(delim, index);
        }
        return count;
    }

    /**
     * A convenience method to strip out new line junk.
     * 
     * @param s The String that needs stripping.
     * @return A new clean string without new line junk.
     */
    public static String stripNewLines(String s) {
        s = s.replaceAll("(\n|\r| \r| \n){2,}", "\n");
        s = s.replaceAll("\n", "<br />");
        s = s.replaceAll("\\<br /\\>~\\<br /\\>", "~");
        return s;
    }
}
