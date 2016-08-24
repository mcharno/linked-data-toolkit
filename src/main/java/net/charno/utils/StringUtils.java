/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net.charno.utils;

/**
 *
 * @author mdc502
 */
public class StringUtils {
    
    public static String makeURLSafe(String value) {
        value = value.replace("\n", "%20").replace("\r", "%20");
        value = value.replace(" ", "%20").replace(";", "%3B").replace(":", "%3A").replace("/", "%2F");
        value = value.replace("\"", "%22").replace("#", "%23").replace("&", "%26").replace("?", "%3F");
        value = value.replace("+", "%2B").replace("@", "%40").replace("=", "%3D");
        value = value.replace("{", "%7B").replace("}", "%7D").replace("[", "%5B").replace("]", "%5D");
        value = value.replace("<", "%3C").replace(">", "%3E");
        
        return value;
    }
    
    public static String capitalise(String input) {
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
}
