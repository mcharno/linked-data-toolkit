
package net.charno.semweb.lookups;

/**
 *
 * @author mdc502
 */
public enum NDGSubjectCategories {
    BIOTA("biota","http://vocab.ndg.nerc.ac.uk/term/P051/0/002"),
    BOUNDARIES("boundaries","http://vocab.ndg.nerc.ac.uk/term/P051/0/003"),
    CLIMATOLOGYMETEOROLOGYATMOSPHERE("climatologyMeteorologyAtmosphere","http://vocab.ndg.nerc.ac.uk/term/P051/0/004"),
    ECONOMY("economy","http://vocab.ndg.nerc.ac.uk/term/P051/0/005"),
    ELEVATION("elevation","http://vocab.ndg.nerc.ac.uk/term/P051/0/006"),
    ENVIRONMENT("environment","http://vocab.ndg.nerc.ac.uk/term/P051/0/007"),
    FARMING("farming","http://vocab.ndg.nerc.ac.uk/term/P051/0/001"),
    GEOSCIENTIFICINFORMATION("geoscientificInformation","http://vocab.ndg.nerc.ac.uk/term/P051/0/008"),
    HEALTH("health","http://vocab.ndg.nerc.ac.uk/term/P051/0/009"),
    IMAGERYBASEMAPSEARTHCOVER("imageryBaseMapsEarthCover","http://vocab.ndg.nerc.ac.uk/term/P051/0/010"),
    INLANDWATERS("inlandWaters","http://vocab.ndg.nerc.ac.uk/term/P051/0/012"),
    INTELLIGENCEMILITARY("intelligenceMilitary","http://vocab.ndg.nerc.ac.uk/term/P051/0/011"),
    LOCATION("location","http://vocab.ndg.nerc.ac.uk/term/P051/0/013"),
    OCEANS("oceans","http://vocab.ndg.nerc.ac.uk/term/P051/0/014"),
    PLANNINGCADASTRE("planningCadastre","http://vocab.ndg.nerc.ac.uk/term/P051/0/015"),
    SOCIETY("society","http://vocab.ndg.nerc.ac.uk/term/P051/0/016"),
    STRUCTURE("structure","http://vocab.ndg.nerc.ac.uk/term/P051/0/017"),
    TRANSPORTATION("transportation","http://vocab.ndg.nerc.ac.uk/term/P051/0/018"),
    UTILITIESCOMMUNICATION("utilitiesCommunication","http://vocab.ndg.nerc.ac.uk/term/P051/0/019");
    
    private String name;
    private String rdf;

    private NDGSubjectCategories(String name, String rdf) {
        this.name = name;
        this.rdf = rdf;
    }
    
    public String getName() {
        return this.name;
    }
    
    public String getRDF() {
        return this.rdf;
    }
}
